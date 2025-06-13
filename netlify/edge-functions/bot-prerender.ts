// netlify/edge-functions/bot-prerender.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
  'google-inspectiontool',  // Added this specifically
  
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

// Cache duration constants
const CACHE_DURATIONS = {
  FRESH_JOB: 43200,      // 12 hours for jobs with >7 days left
  EXPIRING_SOON: 21600,  // 6 hours for jobs with 3-7 days left
  CRITICAL: 3600,        // 1 hour for jobs with <3 days left
  NOT_FOUND: 3600,       // 1 hour for 404s
  GONE: 86400,           // 24 hours for 410s
  ERROR: 300             // 5 minutes for errors
};

function createJobSlug(title: string, company: string, city: string): string {
  const slug = `${title}-${company}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug;
}

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function getJobCacheDuration(job: any): number {
  if (!job.expires_at && !job.created_at) {
    return CACHE_DURATIONS.FRESH_JOB;
  }
  
  const now = new Date();
  const expiresAt = new Date(job.expires_at || job.created_at);
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 3) {
    return CACHE_DURATIONS.CRITICAL;
  } else if (daysUntilExpiry <= 7) {
    return CACHE_DURATIONS.EXPIRING_SOON;
  } else {
    return CACHE_DURATIONS.FRESH_JOB;
  }
}

function getCacheHeadersForBot(userAgent: string, cacheDuration: number): Record<string, string> {
  const ua = userAgent.toLowerCase();
  const staleWhileRevalidate = cacheDuration * 2;
  
  const baseHeaders = {
    'Cache-Control': `public, max-age=${cacheDuration}, stale-while-revalidate=${staleWhileRevalidate}`,
    'CDN-Cache-Control': `public, max-age=${cacheDuration * 2}`,
    'Vary': 'User-Agent',
  };
  
  if (ua.includes('googlebot')) {
    return {
      ...baseHeaders,
      'X-Robots-Tag': 'index, follow',
      'Netlify-CDN-Cache-Control': `public, max-age=${cacheDuration * 2}, stale-while-revalidate=604800`, // 7 days stale
    };
  } else if (ua.includes('facebookexternalhit') || ua.includes('twitterbot') || ua.includes('linkedinbot')) {
    // Social media bots - cache more aggressively
    return {
      ...baseHeaders,
      'Cache-Control': `public, max-age=604800, stale-while-revalidate=1209600`, // 7 days + 14 days stale
      'CDN-Cache-Control': `public, max-age=604800`,
    };
  } else {
    return baseHeaders;
  }
}

function generateJobHTML(job: any, baseUrl: string): { html: string; etag: string } {
  const jobSlug = createJobSlug(job.title || '', job.company_name || '', job.city || '');
  const metaTitle = `${job.title} | Job Board`;
  const metaDescription = job.description ? 
    job.description.substring(0, 155) + '...' : 
    `${job.title} position available. Apply now!`;
  
  const companyName = job.company_name || 'Company';
  const location = job.city || 'Remote';
  const salaryRange = job.salary_min && job.salary_max ? 
    `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}` : 
    'Competitive salary';

  // Generate ETag based on job data
  const jobHash = JSON.stringify({
    id: job.id,
    title: job.title,
    updated_at: job.updated_at,
    expires_at: job.expires_at,
    description: job.description?.substring(0, 100) // First 100 chars for change detection
  });
  
  const etag = `"${btoa(jobHash).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}"`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || `${job.title} position at ${companyName}`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": companyName,
      "url": job.company_website || baseUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": job.city || 'Remote'
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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseUrl}/job/${jobSlug}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    <link rel="canonical" href="${baseUrl}/job/${jobSlug}">
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
</head>
<body>
    <main>
        <article>
            <header>
                <h1>${job.title}</h1>
                <div class="job-meta">
                    <p><strong>Company:</strong> ${companyName}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Salary:</strong> ${salaryRange}</p>
                    ${job.job_type ? `<p><strong>Type:</strong> ${job.job_type}</p>` : ''}
                </div>
            </header>
            
            <section class="job-description">
                <h2>Job Description</h2>
                <div>${job.description || 'No description available.'}</div>
            </section>
            
            ${job.requirements ? `
            <section class="job-requirements">
                <h2>Requirements</h2>
                <div>${job.requirements}</div>
            </section>
            ` : ''}
            
            <section class="application">
                <h2>How to Apply</h2>
                <p>This position is available for applications. Visit our main site to apply.</p>
                ${job.job_url ? `<a href="${job.job_url}" target="_blank" rel="noopener">Apply Now</a>` : ''}
            </section>
        </article>
    </main>
    
    <!-- Bot tracking pixel for analytics dashboard -->
    <img src="${baseUrl}/.netlify/functions/track-bot-visit?job=${encodeURIComponent(jobSlug)}&bot=true&prerendered=true&timestamp=${Date.now()}" width="1" height="1" style="display:none;" alt="tracking" loading="eager">
</body>
</html>`;

  return { html, etag };
}

function generate410HTML(path: string, baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job No Longer Available | Job Board</title>
    <meta name="description" content="This job posting is no longer available. Browse our current job openings.">
    <meta name="robots" content="noindex">
</head>
<body>
    <main>
        <h1>Job No Longer Available</h1>
        <p>This job posting has been removed or has expired.</p>
        <p><a href="${baseUrl}">Browse current job openings</a></p>
    </main>
    
    <!-- Bot tracking pixel -->
    <img src="${baseUrl}/api/track?path=${encodeURIComponent(path)}&status=410&bot=true" width="1" height="1" style="display:none;" alt="">
</body>
</html>`;
}

export default async (request: Request) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  console.log(`🔍 Edge function called for: ${url.pathname}`);
  console.log(`👤 User Agent: ${userAgent}`);
  console.log(`🤖 Bot detection for "${userAgent.toLowerCase()}": ${isBot(userAgent)}`);

  // Only process job pages
  if (!url.pathname.startsWith('/job/')) {
    return;
  }

  // Only pre-render for bots
  if (!isBot(userAgent)) {
    console.log(`👨 Human detected, skipping pre-render for: ${url.pathname}`);
    return;
  }

  console.log(`🤖 Bot detected visiting job page: ${url.pathname}`);

  // Try to get response from Netlify's edge cache first
  try {
    const cacheKey = new Request(url.toString(), {
      headers: {
        'User-Agent': userAgent,
        'X-Cache-Key': `bot-${url.pathname}`
      }
    });
    
    const cachedResponse = await caches.default.match(cacheKey);
    if (cachedResponse) {
      console.log(`⚡ Serving from edge cache: ${url.pathname}`);
      
      // Add cache hit header
      const response = new Response(cachedResponse.body, {
        status: cachedResponse.status,
        headers: {
          ...Object.fromEntries(cachedResponse.headers.entries()),
          'X-Cache-Status': 'HIT',
          'X-Cache-Source': 'edge'
        }
      });
      
      return response;
    }
  } catch (error) {
    console.log(`⚠️ Edge cache check failed: ${error.message}`);
  }

  // Check environment variables
  const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL');
  const supabaseKey = Deno.env.get('VITE_SUPABASE_KEY');
  
  console.log(`🔑 Supabase URL: ${supabaseUrl ? 'Set' : 'Missing'}`);
  console.log(`🔑 Supabase Key: ${supabaseKey ? 'Set' : 'Missing'}`);

  if (!supabaseUrl || !supabaseKey) {
    console.log(`❌ Missing Supabase credentials`);
    return new Response('Configuration error', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'X-Edge-Function': 'bot-prerender-config-error',
        'Cache-Control': `public, max-age=${CACHE_DURATIONS.ERROR}`
      }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const netlifyUrl = Deno.env.get('URL') || 'https://seo-vacancy.eu';

  // Extract job slug from path
  const jobSlug = url.pathname.replace('/job/', '');
  console.log(`🔍 Looking for job with slug: ${jobSlug}`);

  // Load 410 URLs from the handle-410-urls function
  let urlsFor410: string[] = [];
  try {
    const response = await fetch(`${netlifyUrl}/410-urls.txt`);
    if (response.ok) {
      const text = await response.text();
      urlsFor410 = text.split('\n').filter(line => line.trim());
    }
  } catch (error) {
    console.log(`⚠️ Could not load 410 URLs: ${error.message}`);
  }

  // Check if URL is in 410 list first (before hitting Supabase)
  try {
    console.log(`✅ Loaded ${urlsFor410.length} URLs for 410 status`);
    const currentPath = url.pathname;
    
    if (urlsFor410.includes(currentPath)) {
      console.log(`🚫 URL in 410 list: ${currentPath}`);
      const html410 = generate410HTML(currentPath, netlifyUrl);
      
      const response410 = new Response(html410, {
        status: 410,
        headers: {
          'Content-Type': 'text/html',
          'X-Edge-Function': 'bot-prerender-410',
          'Cache-Control': `public, max-age=${CACHE_DURATIONS.GONE}`,
          'X-Cache-Status': 'MISS'
        }
      });

      // Cache the 410 response
      try {
        const cacheKey = new Request(url.toString(), {
          headers: { 'User-Agent': userAgent, 'X-Cache-Key': `bot-${url.pathname}` }
        });
        await caches.default.put(cacheKey, response410.clone());
        console.log(`💾 Cached 410 response: ${currentPath}`);
      } catch (error) {
        console.log(`⚠️ Failed to cache 410 response: ${error.message}`);
      }

      return response410;
    }
  } catch (error) {
    console.log(`⚠️ Error checking 410 list: ${error.message}`);
    // Continue with normal processing if 410 check fails
  }

  // Query Supabase for the job
  try {
    console.log(`📡 Fetching jobs from Supabase...`);
    
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*');

    if (error) {
      console.log(`❌ Supabase error: ${error.message}, code: ${error.code}`);
      return new Response('Database error', { 
        status: 500,
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATIONS.ERROR}`
        }
      });
    }

    if (!jobs || jobs.length === 0) {
      console.log(`❌ No jobs found in database`);
      
      const notFoundResponse = new Response('Job not found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': `public, max-age=${CACHE_DURATIONS.NOT_FOUND}`,
          'X-Cache-Status': 'MISS'
        }
      });

      // Cache 404 responses
      try {
        const cacheKey = new Request(url.toString(), {
          headers: { 'User-Agent': userAgent, 'X-Cache-Key': `bot-${url.pathname}` }
        });
        await caches.default.put(cacheKey, notFoundResponse.clone());
        console.log(`💾 Cached 404 response: ${jobSlug}`);
      } catch (error) {
        console.log(`⚠️ Failed to cache 404: ${error.message}`);
      }

      return notFoundResponse;
    }

    console.log(`📄 Fetched ${jobs.length} jobs from Supabase`);

    // Find job by matching generated slug
    const matchingJob = jobs.find(job => {
      if (!job.title || !job.company_name || !job.city) return false;
      
      const generatedSlug = createJobSlug(job.title, job.company_name, job.city);
      return generatedSlug === jobSlug;
    });

    if (!matchingJob) {
      console.log(`❌ No job found with slug: ${jobSlug}`);
      
      const notFoundResponse = new Response('Job not found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': `public, max-age=${CACHE_DURATIONS.NOT_FOUND}`,
          'X-Cache-Status': 'MISS'
        }
      });

      // Cache 404 responses
      try {
        const cacheKey = new Request(url.toString(), {
          headers: { 'User-Agent': userAgent, 'X-Cache-Key': `bot-${url.pathname}` }
        });
        await caches.default.put(cacheKey, notFoundResponse.clone());
      } catch (error) {
        console.log(`⚠️ Failed to cache 404: ${error.message}`);
      }

      return notFoundResponse;
    }

    console.log(`✅ Found matching job: "${matchingJob.title}" with slug: ${jobSlug}`);
    console.log(`✅ Pre-rendering job for bot: ${matchingJob.title}`);

    // Check if client has current version via ETag
    const { html, etag } = generateJobHTML(matchingJob, netlifyUrl);
    const clientETag = request.headers.get('if-none-match');
    
    if (clientETag === etag) {
      console.log(`🎯 ETag match, returning 304: ${etag}`);
      return new Response(null, { 
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': `public, max-age=${getJobCacheDuration(matchingJob)}`,
          'X-Cache-Status': 'NOT_MODIFIED'
        }
      });
    }

    // Get cache duration and headers based on job age and bot type
    const cacheDuration = getJobCacheDuration(matchingJob);
    const cacheHeaders = getCacheHeadersForBot(userAgent, cacheDuration);
    
    const response = new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'X-Edge-Function': 'bot-prerender',
        'X-Cache-Status': 'MISS',
        'X-Job-Expires': matchingJob.expires_at || 'unknown',
        'X-Cache-Duration': cacheDuration.toString(),
        'ETag': etag,
        ...cacheHeaders
      }
    });

    // Store in edge cache for future requests
    try {
      const cacheKey = new Request(url.toString(), {
        headers: {
          'User-Agent': userAgent,
          'X-Cache-Key': `bot-${url.pathname}`
        }
      });
      
      await caches.default.put(cacheKey, response.clone());
      console.log(`💾 Cached job HTML: ${jobSlug} (${cacheDuration}s)`);
    } catch (error) {
      console.log(`⚠️ Failed to cache response: ${error.message}`);
    }

    return response;

  } catch (error) {
    console.log(`❌ Error in edge function: ${error.message}`);
    return new Response('Internal server error', { 
      status: 500,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATIONS.ERROR}`
      }
    });
  }
};

export const config = {
  path: "/job/*"
};