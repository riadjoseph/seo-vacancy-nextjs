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

function generateJobHTML(job: any, baseUrl: string): string {
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
    
    <!-- Bot tracking pixel -->
    <img src="${baseUrl}/api/track?job=${encodeURIComponent(jobSlug)}&bot=true&prerendered=true" width="1" height="1" style="display:none;" alt="">
</body>
</html>`;
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

  // Check environment variables first
  const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL');
  const supabaseKey = Deno.env.get('VITE_SUPABASE_KEY'); // Changed from VITE_SUPABASE_ANON_KEY
  
  console.log(`🔑 Supabase URL: ${supabaseUrl ? 'Set' : 'Missing'}`);
  console.log(`🔑 Supabase Key: ${supabaseKey ? 'Set' : 'Missing'}`);

  if (!supabaseUrl || !supabaseKey) {
    console.log(`❌ Missing Supabase credentials`);
    return new Response('Configuration error', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'X-Edge-Function': 'bot-prerender-config-error'
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
      return new Response(html410, {
        status: 410,
        headers: {
          'Content-Type': 'text/html',
          'X-Edge-Function': 'bot-prerender-410',
          'Cache-Control': 'public, max-age=86400' // Cache 410s for 24 hours
        }
      });
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
      return new Response('Database error', { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
      console.log(`❌ No jobs found in database`);
      return new Response('Job not found', { status: 404 });
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
      return new Response('Job not found', { status: 404 });
    }

    console.log(`✅ Found matching job: "${matchingJob.title}" with slug: ${jobSlug}`);
    console.log(`✅ Pre-rendering job for bot: ${matchingJob.title}`);

    // Generate the pre-rendered HTML
    const html = generateJobHTML(matchingJob, netlifyUrl);
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'X-Edge-Function': 'bot-prerender',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.log(`❌ Error in edge function: ${error.message}`);
    return new Response('Internal server error', { status: 500 });
  }
};

export const config = {
  path: "/job/*"
};