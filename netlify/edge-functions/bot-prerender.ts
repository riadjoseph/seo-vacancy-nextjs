// netlify/edge-functions/bot-prerender.ts

// Minimal context type to avoid TS warnings
interface NetlifyContext {
  next: () => Response | Promise<Response>;
}

const BOT_USER_AGENTS = [
  // Search engine bots
  'adsbot',
  'applebot',
  'baiduspider',
  'googlebot',
  'mediapartners-google',
  'yandex',
  'yandexbot',
  'bingbot',
  'naver',
  'baidu',
  'bing',
  'google',
  
  // AI/LLM bots
  'gptbot',
  'amazonbot',
  'anthropic',
  'bytespider',
  'ccbot',
  'chatgpt',
  'claudebot',
  'claude',
  'oai-searchbot',
  'perplexity',
  'youbot',
  
  // Social media bots
  'facebook',
  'facebookexternalhit',
  'meta-external',
  'twitterbot',
  'linkedinbot',
  
  // Other common crawlers
  'slurp',
  'duckduckbot',
  'whatsapp',
  'telegram'
];

// Cache for the 410 URLs to integrate with your existing system
let cached410Urls: Set<string> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function get410Urls(): Promise<Set<string>> {
  const now = Date.now();
  
  if (cached410Urls && (now - cacheTimestamp) < CACHE_DURATION) {
    return cached410Urls;
  }

  try {
    const response = await fetch(`${Deno.env.get('URL')}/410-urls.txt`);
    
    if (!response.ok) {
      return new Set();
    }

    const text = await response.text();
    const urls = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(url => {
        if (url.startsWith('http')) {
          try {
            return new URL(url).pathname;
          } catch {
            return url;
          }
        }
        return url.startsWith('/') ? url : `/${url}`;
      });

    cached410Urls = new Set(urls);
    cacheTimestamp = now;
    
    return cached410Urls;
    
  } catch (error) {
    console.error('Error loading 410 URLs in bot-prerender:', error);
    return cached410Urls || new Set();
  }
}

const isBot = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
};

const createJobSlug = (title: string, company: string, city: string): string => {
  const slug = `${title}-${company}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug;
};

export default async (request: Request, context: NetlifyContext) => {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Only process for bots visiting job pages
  if (!isBot(userAgent) || !pathname.startsWith('/job/')) {
    return context.next();
  }

  console.log(`🤖 Bot detected: ${userAgent} visiting ${pathname}`);

  try {
    // Check if this URL is in your 410 list first
    const urls410 = await get410Urls();
    if (urls410.has(pathname)) {
      console.log(`🚫 URL in 410 list: ${pathname}`);
      
      const expiredHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Job No Longer Available | Job Board</title>
          <meta name="robots" content="noindex">
          <meta http-equiv="status" content="410">
          <meta name="description" content="This job posting is no longer available and has been permanently removed.">
        </head>
        <body>
          <main>
            <h1>Job No Longer Available</h1>
            <p>This job posting has been permanently removed and is no longer available.</p>
            <p><a href="/">Browse current job openings</a></p>
          </main>
        </body>
        </html>
      `;
      
      return new Response(expiredHtml, {
        status: 410,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=86400', // 1 day cache for 410s
          'X-Prerendered-For': userAgent
        }
      });
    }

    // Extract job slug from URL
    const slug = pathname.split('/job/')[1];
    if (!slug) {
      return context.next();
    }

    // Fetch job data from Supabase
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL');
    const supabaseKey = Deno.env.get('VITE_SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return context.next();
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/jobs?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Supabase fetch failed:', response.status);
      return context.next();
    }

    const jobs = await response.json();
    
    // Find matching job
    const job = jobs.find((job: any) => {
      if (!job.title || !job.company_name) return false;
      const jobSlug = createJobSlug(job.title, job.company_name, job.city || 'Remote');
      return jobSlug === slug;
    });

    if (!job) {
      console.log(`❌ Job not found for slug: ${slug}`);
      
      // Return 404 HTML for bots
      const notFoundHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Job Not Found | Job Board</title>
          <meta name="robots" content="noindex">
          <meta http-equiv="status" content="404">
          <meta name="description" content="The job posting you're looking for doesn't exist or has been removed.">
        </head>
        <body>
          <main>
            <h1>Job Not Found</h1>
            <p>The job posting you're looking for doesn't exist or has been removed.</p>
            <p><a href="/">Browse current job openings</a></p>
          </main>
        </body>
        </html>
      `;
      
      return new Response(notFoundHtml, {
        status: 404,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=300', // 5 minute cache for 404s
          'X-Prerendered-For': userAgent
        }
      });
    }

    // Check if expired (this would be different from your 410 list)
    const isExpired = new Date(job.expires_at) < new Date();
    if (isExpired) {
      console.log(`⏰ Job expired: ${job.title}`);
      
      const expiredHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Job Expired | ${job.title}</title>
          <meta name="robots" content="noindex">
          <meta http-equiv="status" content="410">
          <meta name="description" content="${job.title} at ${job.company_name} has expired and is no longer accepting applications.">
        </head>
        <body>
          <main>
            <h1>Job Expired</h1>
            <h2>${job.title} at ${job.company_name}</h2>
            <p>This job posting has expired and is no longer accepting applications.</p>
            <p><strong>Location:</strong> ${job.city || 'Remote'}</p>
            <p><strong>Originally posted:</strong> ${new Date(job.created_at).toLocaleDateString()}</p>
            <p><a href="/">Browse current job openings</a></p>
          </main>
        </body>
        </html>
      `;
      
      return new Response(expiredHtml, {
        status: 410,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600', // 1 hour cache for expired jobs
          'X-Prerendered-For': userAgent
        }
      });
    }

    console.log(`✅ Job found for bot: ${job.title}`);

    // Escape JSON strings to prevent XSS
    const escapeJsonString = (str: string) => str.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');

    // Pre-render job page for bot
    const jobHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeJsonString(job.title)} | ${escapeJsonString(job.company_name)} | Job Board</title>
        <meta name="description" content="${escapeJsonString(job.description.substring(0, 160))}...">
        <meta name="robots" content="index,follow">
        <link rel="canonical" href="${url.toString()}">
        
        <!-- Job Structured Data -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org/",
          "@type": "JobPosting",
          "title": "${escapeJsonString(job.title)}",
          "description": "${escapeJsonString(job.description)}",
          "hiringOrganization": {
            "@type": "Organization",
            "name": "${escapeJsonString(job.company_name)}"
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "${escapeJsonString(job.city || 'Remote')}"
            }
          },
          "employmentType": "${job.employment_type || 'FULL_TIME'}",
          "datePosted": "${job.created_at}",
          "validThrough": "${job.expires_at}",
          "url": "${url.toString()}"
        }
        </script>
        
        <!-- Your Bot Tracking Pixel -->
        <img src="https://wiki.booksparis.com/tracker.php?url=${encodeURIComponent(url.toString())}&title=${encodeURIComponent(job.title)}&status=200&netlify=true&prerendered=true" width="1" height="1" style="position:absolute;left:-9999px;" alt="" />
      </head>
      <body>
        <main>
          <h1>${escapeJsonString(job.title)}</h1>
          <h2>${escapeJsonString(job.company_name)}</h2>
          <p><strong>Location:</strong> ${escapeJsonString(job.city || 'Remote')}</p>
          <p><strong>Employment Type:</strong> ${job.employment_type || 'Full-time'}</p>
          <p><strong>Posted:</strong> ${new Date(job.created_at).toLocaleDateString()}</p>
          <div>
            <h3>Job Description</h3>
            <div>${job.description.replace(/\n/g, '<br>')}</div>
          </div>
        </main>
      </body>
      </html>
    `;

    return new Response(jobHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=1800', // 30 minute cache
        'X-Prerendered-For': userAgent,
        'X-Bot-Prerender': 'true'
      }
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return context.next();
  }
};

export const config = {
  path: "/job/*"
};