
import type { Context } from '@netlify/edge-functions';

// In-memory deduplication map
const pendingRequests = new Map<string, { html: string; init: ResponseInit }>();

// Cache for 410 URLs
let cached410Urls: Set<string> | null = null;
let cache410Timestamp = 0;
const CACHE_410_DURATION = 5 * 60 * 1000; // 5 minutes

const BOT_USER_AGENTS = [
  // Search engine bots
  'adsbot', 'applebot', 'baiduspider', 'googlebot', 'mediapartners-google',
  'yandex', 'yandexbot', 'bingbot', 'naver', 'baidu', 'bing', 'google',
  'google-inspectiontool',
  // AI/LLM bots
  'gptbot', 'amazonbot', 'anthropic', 'bytespider', 'ccbot', 'chatgpt',
  'claudebot', 'claude', 'oai-searchbot', 'perplexity', 'youbot',
  // Social media bots
  'facebook', 'facebookexternalhit', 'meta-external', 'twitterbot', 'linkedinbot',
  // Other common crawlers
  'slurp', 'duckduckbot', 'whatsapp', 'telegram'
];

function createJobSlug(title: string, company: string, city: string): string {
  return `${title}-${company}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

async function get410Urls(netlifyUrl: string): Promise<Set<string>> {
  const now = Date.now();
  
  // Return cached URLs if cache is still valid
  if (cached410Urls && (now - cache410Timestamp) < CACHE_410_DURATION) {
    return cached410Urls;
  }

  try {
    console.log(`🔄 Loading 410 URLs from ${netlifyUrl}/410-urls.txt`);
    const response = await fetch(`${netlifyUrl}/410-urls.txt`);
    
    if (!response.ok) {
      console.warn('Could not fetch 410-urls.txt file');
      return cached410Urls || new Set();
    }

    const text = await response.text();
    const urls = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
      .map(url => {
        // Handle both full URLs and paths
        if (url.startsWith('http')) {
          try {
            return new URL(url).pathname;
          } catch {
            return url;
          }
        }
        // Ensure URL starts with /
        return url.startsWith('/') ? url : `/${url}`;
      });

    cached410Urls = new Set(urls);
    cache410Timestamp = now;
    
    console.log(`✅ Loaded ${urls.length} URLs for 410 status`);
    return cached410Urls;
    
  } catch (error) {
    console.warn(`⚠️ Could not load 410 URLs: ${error.message}`);
    return cached410Urls || new Set();
  }
}

function getJobCacheDuration(job: any): number {
  if (!job.expires_at && !job.created_at) return 43200; // 12h default
  
  const now = new Date();
  const expiresAt = new Date(job.expires_at || job.created_at);
  const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysLeft <= 3) return 3600;   // 1 hour for expiring soon
  if (daysLeft <= 7) return 21600;  // 6 hours for moderate
  return 43200; // 12 hours for fresh jobs
}

function getCacheHeaders(userAgent: string, cacheDuration: number): Record<string, string> {
  const ua = userAgent.toLowerCase();
  const staleTime = cacheDuration * 2;
  
  if (ua.includes('facebookexternalhit') || ua.includes('twitterbot') || ua.includes('linkedinbot')) {
    // Social media bots - cache more aggressively
    return {
      'Cache-Control': `public, max-age=604800, stale-while-revalidate=1209600`, // 7 days + 14 days stale
      'CDN-Cache-Control': `public, max-age=604800`
    };
  }
  
  return {
    'Cache-Control': `public, max-age=${cacheDuration}, stale-while-revalidate=${staleTime}`,
    'CDN-Cache-Control': `public, max-age=${cacheDuration * 2}`,
    'Netlify-CDN-Cache-Control': `public, max-age=${cacheDuration * 2}, stale-while-revalidate=604800`
  };
}

function sanitizeForHTML(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[…]/g, '...')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateBreadcrumbHtml(job: any, baseUrl: string, jobSlug: string): string {
  const city = sanitizeForHTML(job.city || 'Unknown');
  const title = sanitizeForHTML(job.title || 'Job');
  const fullTitle = `${title} - ${city}`;
  return `
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="${baseUrl}">Jobs</a></li>
    <li><a href="${baseUrl}/jobs/city/${encodeURIComponent(city.toLowerCase())}">SEO Jobs in ${city}</a></li>
    <li aria-current="page">${fullTitle}</li>
  </ol>
</nav>
  `.trim();
}

function generateBreadcrumbJsonLd(job: any, baseUrl: string, jobSlug: string): object {
  const city = job.city || 'Unknown';
  const title = job.title || 'Job';
  const fullTitle = `${title} - ${city}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Jobs",
        "item": `${baseUrl}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `SEO Jobs in ${city}`,
        "item": `${baseUrl}/jobs/city/${encodeURIComponent(city.toLowerCase())}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": fullTitle,
        "item": `${baseUrl}/job/${jobSlug}`
      }
    ]
  };
}

function generateJobHTML(job: any, baseUrl: string, requestedSlug: string): string {
  const title = sanitizeForHTML(job.title || '');
  const description = sanitizeForHTML(job.description || '');
  const companyName = sanitizeForHTML(job.company_name || 'Company');
  const location = sanitizeForHTML(job.city || 'Remote');
  const requirements = sanitizeForHTML(job.requirements || '');
  
  // Use the improved SEO title format
  const metaTitle = `${title}, ${companyName} - SEO Jobs in Europe`;
  const metaDescription = description ? 
    description.substring(0, 155) + '...' : 
    `${title} position available. Apply now!`;
  
  const salaryRange = job.salary_min && job.salary_max ? 
    `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}` : 
    'Competitive salary';

  // Use the requested URL slug directly (no generation needed!)
  const canonicalSlug = requestedSlug;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": title,
    "description": description || `${title} position at ${companyName}`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": companyName,
      "url": job.company_website || baseUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": location
    },
    "employmentType": job.job_type || "FULL_TIME",
    "datePosted": job.created_at || new Date().toISOString(),
    "validThrough": job.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "baseSalary": job.salary_min && job.salary_max ? {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salary_min,
        "maxValue": job.salary_max,
        "unitText": "YEAR"
      }
    } : undefined
  };

  // Breadcrumb HTML and JSON-LD
  const breadcrumbHtml = generateBreadcrumbHtml(job, baseUrl, requestedSlug);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(job, baseUrl, requestedSlug);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseUrl}/job/${canonicalSlug}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    <link rel="canonical" href="${baseUrl}/job/${canonicalSlug}">
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
</head>
<body>
    ${breadcrumbHtml}
    <main>
        <article>
            <header>
                <h1>${title}</h1>
                <div class="job-meta">
                    <p><strong>Company:</strong> ${companyName}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Salary:</strong> ${salaryRange}</p>
                    ${job.job_type ? `<p><strong>Type:</strong> ${sanitizeForHTML(job.job_type)}</p>` : ''}
                </div>
            </header>
            
            <section class="job-description">
                <h2>Job Description</h2>
                <div>${description || 'No description available.'}</div>
            </section>
            
            ${requirements ? `
            <section class="job-requirements">
                <h2>Requirements</h2>
                <div>${requirements}</div>
            </section>
            ` : ''}
            
            <section class="application">
                <h2>How to Apply</h2>
                <p>This position is available for applications. Visit our main site to apply.</p>
                ${job.job_url ? `<a href="${sanitizeForHTML(job.job_url)}" target="_blank" rel="noopener">Apply Now</a>` : ''}
            </section>
        </article>
    </main>
    
    <img src="${baseUrl}/.netlify/functions/track-bot-visit?job=${encodeURIComponent(canonicalSlug)}&bot=true&prerendered=true&timestamp=${Date.now()}" width="1" height="1" style="display:none;" alt="tracking" loading="eager">
</body>
</html>`;
}

function generate410HTML(path: string, baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job No Longer Available</title>
    <meta name="description" content="This job posting is no longer available. Browse our current job openings.">
    <meta name="robots" content="noindex">
    <meta property="og:title" content="Job No Longer Available">
    <meta property="og:description" content="This job posting is no longer available. Browse our current job openings.">
</head>
<body>
    <div class="container max-w-2xl mx-auto py-12 px-4">
      <div class="text-center space-y-6">
        <div class="space-y-4">
          <h1 class="text-4xl font-bold text-gray-900">That Job is No Longer Available</h1>
          <p class="text-xl text-gray-600">This job posting has been removed or has expired.</p>
        </div>
        <div class="flex justify-center gap-4 mt-8">
          <a class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" href="${baseUrl}">Browse Current SEO Jobs</a>
        </div>
      </div>
    </div>
</body>
</html>`;
}

// Direct Supabase REST API call - no dependencies needed!
async function querySupabase(url: string, key: string, query: string): Promise<any[]> {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const response = await fetch(`${url}/rest/v1/jobs?${query}`, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export default async (request: Request, context: Context) => {
  // Environment variables
  const { env } = context;
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_KEY;
  const netlifyUrl = env.URL || 'https://seo-vacancy.eu';

  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const jobSlug = url.pathname.replace('/job/', '');
  const cacheKey = `/job/${jobSlug}`;

  console.log(`🔍 Edge function called for: ${url.pathname}`);
  console.log(`👤 User Agent: ${userAgent}`);
  console.log(`🤖 Bot detection: ${isBot(userAgent)}`);

  // Only handle job pages for bots
  if (!url.pathname.startsWith('/job/') || !isBot(userAgent)) {
    console.log(`👨 Human detected or not job page, skipping`);
    return;
  }

  console.log(`🤖 Bot detected visiting job page`);

  if (!supabaseUrl || !supabaseKey) {
    console.log(`❌ Missing Supabase credentials`);
    return new Response('Configuration error', {
      status: 500,
      headers: { 
        'Content-Type': 'text/plain', 
        'X-Edge-Function': 'bot-prerender-config-error', 
        'Cache-Control': 'public, max-age=300' 
      }
    });
  }

  // FIRST: Check 410 list before any database queries
  const urls410 = await get410Urls(netlifyUrl);
  if (urls410.has(url.pathname)) {
    console.log(`🚫 Returning 410 for: ${url.pathname}`);
    const html410 = generate410HTML(url.pathname, netlifyUrl);
    return new Response(html410, {
      status: 410,
      headers: { 
        'Content-Type': 'text/html',
        'X-Edge-Function': 'bot-prerender-410',
        'X-410-Source': 'cache',
        'Cache-Control': 'public, max-age=86400' 
      }
    });
  }

  // Deduplication: serve existing result if present
  if (pendingRequests.has(cacheKey)) {
    console.log(`⚡ Deduplicating concurrent request for: ${cacheKey}`);
    const { html, init } = pendingRequests.get(cacheKey)!;
    return new Response(html, init);
  }

  // Set up async handler for this request
  const requestPromise = (async (): Promise<Response> => {
    // 🚀 OPTIMIZED QUERY using direct REST API
    try {
      console.log(`📡 Querying job by slug: ${jobSlug}`);
      
      let job: any = null;
      
      // Primary: Query by slug column (should work now!)
      try {
        const jobs = await querySupabase(
          supabaseUrl, 
          supabaseKey, 
          `slug=eq.${encodeURIComponent(jobSlug)}&limit=1`
        );
        
        if (jobs && jobs.length > 0) {
          job = jobs[0];
          console.log(`⚡ Found job via optimized query: "${job.title}"`);
        } else {
          console.log(`⚠️ No job found with slug: ${jobSlug}`);
        }
      } catch (slugError) {
        console.log(`⚠️ Slug query failed: ${slugError.message}`);
      }

      // Fallback: If slug query fails or no result, try the old method
      if (!job) {
        console.log(`🔄 Falling back to full table scan...`);
        
        try {
          const jobs = await querySupabase(supabaseUrl, supabaseKey, 'select=*');
          console.log(`📄 Scanning ${jobs.length} jobs for slug match...`);

          // Find job by matching generated slug
          const matchingJob = jobs.find(jobItem => {
            if (!jobItem.title || !jobItem.company_name || !jobItem.city) return false;
            const generatedSlug = createJobSlug(jobItem.title, jobItem.company_name, jobItem.city);
            return generatedSlug === jobSlug;
          });

          if (matchingJob) {
            job = matchingJob;
            console.log(`✅ Found job via fallback: "${job.title}"`);
          }
        } catch (fallbackError) {
          console.log(`❌ Fallback query error: ${fallbackError.message}`);
          return new Response('Database error', { 
            status: 500,
            headers: { 'Cache-Control': 'public, max-age=300' }
          });
        }
      }

      if (!job) {
        console.log(`❌ No job found with slug: ${jobSlug}`);
        // Return 404 and suggest adding to 410 list
        return new Response(`Job not found: ${jobSlug}. Consider adding to 410 list.`, { 
          status: 404,
          headers: { 
            'Content-Type': 'text/plain',
            'X-Missing-Slug': jobSlug,
            'Cache-Control': 'public, max-age=3600' 
          }
        });
      }

      console.log(`✅ Pre-rendering for bot: ${job.title}`);

      // Generate HTML and response
      const html = generateJobHTML(job, netlifyUrl, jobSlug);
      const cacheDuration = getJobCacheDuration(job);
      const cacheHeaders = getCacheHeaders(userAgent, cacheDuration);
      
      console.log(`💾 Cache duration: ${cacheDuration}s (expires: ${job.expires_at || 'unknown'})`);
      
      const init: ResponseInit = {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'X-Edge-Function': 'bot-prerender-rest',
          'X-Job-Expires': job.expires_at || 'unknown',
          'X-Cache-Duration': cacheDuration.toString(),
          'X-Query-Method': job.slug === jobSlug ? 'optimized' : 'fallback',
          'Vary': 'User-Agent',
          ...cacheHeaders
        }
      };
      // Cache raw HTML and init for deduplication
      pendingRequests.set(cacheKey, { html, init });
      setTimeout(() => pendingRequests.delete(cacheKey), 1000);
      return new Response(html, init);

    } catch (error) {
      console.log(`❌ Error in edge function: ${error.message}`);
      return new Response('Internal server error', { 
        status: 500, 
        headers: { 'Cache-Control': 'public, max-age=300' } 
      });
    }
  })();

  return requestPromise;
};

export const config = { path: "/job/*" };