// netlify/edge-functions/bot-prerender.ts

// In-memory deduplication map
const pendingRequests = new Map<string, Promise<Response>>();

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
</head>
<body>
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
    <meta name="viewport" content="width=device-1.0">
    <title>Job No Longer Available</title>
    <meta name="description" content="This job posting is no longer available. Browse our current job openings.">
    <meta name="robots" content="noindex">
</head>
<body>
    <main>
        <h1>Job No Longer Available</h1>
        <p>This job posting has been removed or has expired.</p>
        <p><a href="${baseUrl}">Browse current job openings</a></p>
    </main>
    <img src="${baseUrl}/api/track?path=${encodeURIComponent(path)}&status=410&bot=true" width="1" height="1" style="display:none;" alt="">
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

export default async (request: Request) => {
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

  // Deduplication: serve existing promise if present
  if (pendingRequests.has(cacheKey)) {
    console.log(`⚡ Deduplicating concurrent request for: ${cacheKey}`);
    const cachedResponse = await pendingRequests.get(cacheKey);
    return cachedResponse?.clone();
  }

  // Set up async handler for this request
  const requestPromise = (async (): Promise<Response> => {
    // Environment variables
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL');
    const supabaseKey = Deno.env.get('VITE_SUPABASE_KEY');
    const netlifyUrl = Deno.env.get('URL') || 'https://seo-vacancy.eu';

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

    // Check 410 list first (optional optimization)
    try {
      const response = await fetch(`${netlifyUrl}/410-urls.txt`);
      if (response.ok) {
        const text = await response.text();
        const urlsFor410 = text.split('\n').filter(line => line.trim());
        if (urlsFor410.includes(url.pathname)) {
          console.log(`🚫 URL in 410 list: ${url.pathname}`);
          const html410 = generate410HTML(url.pathname, netlifyUrl);
          return new Response(html410, {
            status: 410,
            headers: { 
              'Content-Type': 'text/html',
              'X-Edge-Function': 'bot-prerender-410',
              'Cache-Control': 'public, max-age=86400' 
            }
          });
        }
      }
    } catch (error) {
      console.log(`⚠️ Could not load 410 URLs: ${error.message}`);
    }

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
        return new Response('Job not found', { 
          status: 404,
          headers: { 'Cache-Control': 'public, max-age=3600' }
        });
      }

      console.log(`✅ Pre-rendering for bot: ${job.title}`);

      // Generate HTML and response
      const html = generateJobHTML(job, netlifyUrl, jobSlug);
      const cacheDuration = getJobCacheDuration(job);
      const cacheHeaders = getCacheHeaders(userAgent, cacheDuration);
      
      console.log(`💾 Cache duration: ${cacheDuration}s (expires: ${job.expires_at || 'unknown'})`);
      
      return new Response(html, {
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
      });

    } catch (error) {
      console.log(`❌ Error in edge function: ${error.message}`);
      return new Response('Internal server error', { 
        status: 500, 
        headers: { 'Cache-Control': 'public, max-age=300' } 
      });
    }
  })();

  // Store promise and clean up
  pendingRequests.set(cacheKey, requestPromise);
  setTimeout(() => pendingRequests.delete(cacheKey), 1000);

  return requestPromise;
};

export const config = { path: "/job/*" };