// netlify/edge-functions/homepage-bot-prerender.ts

// In-memory cache for homepage data
let cachedHomepageData: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function createJobSlug(title: string, company: string, city: string): string {
  return `${title}-${company}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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

function extractTags(description: string, requirements: string): string[] {
  const text = `${description} ${requirements}`.toLowerCase();
  const commonTags = [
    'technical seo', 'enterprise seo', 'local seo', 'e-commerce seo',
    'content seo', 'link building', 'enterprise seo',
    'google analytics', 'google ads', 'ppc', 'sem',
    'javascript seo', 'international seo', 'mobile seo'
  ];
  
  return commonTags.filter(tag => text.includes(tag)).slice(0, 3);
}

function generateJobCard(job: any, baseUrl: string): string {
  const title = sanitizeForHTML(job.title || '');
  const company = sanitizeForHTML(job.company_name || 'Company');
  const city = sanitizeForHTML(job.city || 'Remote');
  const description = sanitizeForHTML(job.description || '');
  const jobSlug = job.slug || createJobSlug(job.title, job.company_name, job.city);
  
  // Extract salary info
  const salaryText = job.salary_min && job.salary_max ? 
    `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}` : 
    'Competitive salary';
  
  // Generate tags from description
  const tags = extractTags(job.description || '', job.requirements || '');
  
  // Company logo (fallback to placeholder)
  const logoUrl = job.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=3b82f6&color=fff&size=48`;
  
  const tagsHTML = tags.map(tag => 
    `<span class="tag">${sanitizeForHTML(tag)}</span>`
  ).join('');

  return `
    <div class="job-card">
      <div class="job-header">
        <div class="job-info">
          <img src="${logoUrl}" alt="${company}" class="company-logo" width="48" height="48">
          <div class="job-details">
            <h3><a href="${baseUrl}/job/${jobSlug}">${title}</a></h3>
            <p class="company">${company}</p>
            <p class="location">📍 ${city}</p>
          </div>
        </div>
        <div class="salary">${salaryText}</div>
      </div>
      
      <div class="job-description">
        <p>${description.substring(0, 150)}${description.length > 150 ? '...' : ''}</p>
      </div>
      
      ${tags.length > 0 ? `<div class="job-tags">${tagsHTML}</div>` : ''}
      
      <div class="job-actions">
        <a href="${baseUrl}/job/${jobSlug}" class="apply-btn">View ${title}</a>
      </div>
    </div>
  `;
}

function generateHomepageHTML(jobs: any[], baseUrl: string): string {
  const jobCardsHTML = jobs.map(job => generateJobCard(job, baseUrl)).join('');
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SEO Jobs in Europe",
    "url": baseUrl,
    "description": "Find the latest SEO jobs in European cities.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const jobListingData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": jobs.slice(0, 20).map((job, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description || `${job.title} position at ${job.company_name}`,
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.company_name
        },
        "jobLocation": {
          "@type": "Place",
          "address": job.city
        },
        "datePosted": job.created_at,
        "url": `${baseUrl}/job/${job.slug || createJobSlug(job.title, job.company_name, job.city)}`
      }
    }))
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Jobs in Europe - Top SEO Careers & Opportunities</title>
    <meta name="description" content="Discover ${jobs.length} SEO job opportunities across Europe. Technical SEO, Content Marketing, Link Building, Enterprise SEO positions available.">
    <meta property="og:title" content="SEO Jobs in Europe - Top SEO Careers & Opportunities">
    <meta property="og:description" content="Discover ${jobs.length} SEO job opportunities across Europe. Technical SEO, Content Marketing, Link Building, Enterprise SEO positions available.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseUrl}">
    <meta property="og:image" content="${baseUrl}/seo-job-board.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="SEO Jobs in Europe - Top SEO Careers & Opportunities">
    <meta name="twitter:description" content="Discover ${jobs.length} SEO job opportunities across Europe.">
    <link rel="canonical" href="${baseUrl}">
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
    <script type="application/ld+json">${JSON.stringify(jobListingData)}</script>
    
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f8fafc;
        color: #334155;
        line-height: 1.6;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .header {
        text-align: center;
        margin-bottom: 40px;
        padding: 40px 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .header h1 {
        font-size: 2.5rem;
        margin: 0 0 16px 0;
        color: #1e293b;
      }
      
      .header p {
        font-size: 1.2rem;
        color: #64748b;
        margin: 0;
      }
      
      .stats {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 20px;
      }
      
      .stat {
        text-align: center;
      }
      
      .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #3b82f6;
      }
      
      .jobs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 24px;
        margin-top: 40px;
      }
      
      .job-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        border: 1px solid #e2e8f0;
      }
      
      .job-card:hover {
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        transform: translateY(-2px);
      }
      
      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
      }
      
      .job-info {
        display: flex;
        gap: 16px;
        align-items: flex-start;
        flex: 1;
      }
      
      .company-logo {
        border-radius: 8px;
        flex-shrink: 0;
      }
      
      .job-details h3 {
        margin: 0 0 8px 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      .job-details h3 a {
        color: #1e293b;
        text-decoration: none;
      }
      
      .job-details h3 a:hover {
        color: #3b82f6;
      }
      
      .company {
        margin: 0 0 4px 0;
        color: #64748b;
        font-weight: 500;
      }
      
      .location {
        margin: 0;
        color: #64748b;
        font-size: 0.9rem;
      }
      
      .salary {
        background: #eff6ff;
        color: #1d4ed8;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
      }
      
      .job-description {
        margin: 16px 0;
      }
      
      .job-description p {
        margin: 0;
        color: #64748b;
        line-height: 1.5;
      }
      
      .job-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 16px 0;
      }
      
      .tag {
        background: #dbeafe;
        color: #1e40af;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
      }
      
      .apply-btn {
        display: inline-block;
        background: #3b82f6;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s;
        width: 100%;
        text-align: center;
        box-sizing: border-box;
      }
      
      .apply-btn:hover {
        background: #2563eb;
      }
      
      .footer {
        text-align: center;
        margin-top: 60px;
        padding: 40px 0;
        border-top: 1px solid #e2e8f0;
        background: white;
        border-radius: 12px;
      }
      
      @media (max-width: 768px) {
        .jobs-grid {
          grid-template-columns: 1fr;
        }
        
        .stats {
          flex-direction: column;
          gap: 20px;
        }
        
        .job-header {
          flex-direction: column;
          gap: 16px;
        }
        
        .salary {
          align-self: flex-start;
        }
      }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>SEO Jobs in Europe</h1>
            <p>Discover the best SEO career opportunities across Europe</p>
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">${jobs.length}</div>
                    <div>Active Jobs</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${new Set(jobs.map(j => j.city)).size}</div>
                    <div>Cities</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${new Set(jobs.map(j => j.company_name)).size}</div>
                    <div>Companies</div>
                </div>
            </div>
        </header>

        <main>
            <div class="jobs-grid">
                ${jobCardsHTML}
            </div>
        </main>

        <footer class="footer">
            <p>Find your next SEO career opportunity in Europe</p>
            <p><a href="${baseUrl}/about">About</a> | <a href="${baseUrl}/contact">Contact</a> | <a href="${baseUrl}/privacy">Privacy</a></p>
        </footer>
    </div>
    
    <img src="${baseUrl}/.netlify/functions/track-bot-visit?page=homepage&bot=true&jobs=${jobs.length}&timestamp=${Date.now()}" width="1" height="1" style="display:none;" alt="tracking" loading="eager">
</body>
</html>`;
}

// Direct Supabase REST API call
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

async function getHomepageJobs(supabaseUrl: string, supabaseKey: string): Promise<any[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedHomepageData && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log(`[homepage-bot] ⚡ Using cached homepage data (${Math.round((now - cacheTimestamp) / (60 * 1000))} minutes old)`);
    return cachedHomepageData;
  }

  console.log(`[homepage-bot] 🔄 Fetching fresh job data from Supabase`);
  
  try {
    // Get all jobs, ordered by creation date (newest first)
    const jobs = await querySupabase(
      supabaseUrl,
      supabaseKey,
      'select=*&order=created_at.desc'
    );

    // Filter out expired jobs and limit to reasonable number for homepage
    const activeJobs = jobs
      .filter(job => {
        if (!job.expires_at) return true;
        return new Date(job.expires_at) > new Date();
      })
      .slice(0, 50); // Limit to 50 jobs for performance

    console.log(`[homepage-bot] ✅ Loaded ${activeJobs.length} active jobs (from ${jobs.length} total)`);
    
    // Cache the results
    cachedHomepageData = activeJobs;
    cacheTimestamp = now;
    
    return activeJobs;
    
  } catch (error) {
    console.log(`[homepage-bot] ❌ Error fetching jobs: ${error.message}`);
    
    // Return cached data if available, even if expired
    if (cachedHomepageData) {
      console.log(`[homepage-bot] 🔄 Falling back to cached data`);
      return cachedHomepageData;
    }
    
    throw error;
  }
}

export default async (request: Request) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  console.log(`[homepage-bot] 🔍 Homepage request: ${url.pathname}`);
  console.log(`[homepage-bot] 👤 User Agent: ${userAgent}`);
  console.log(`[homepage-bot] 🤖 Bot detection: ${isBot(userAgent)}`);

  // Only handle homepage for bots
  if (url.pathname !== '/' || !isBot(userAgent)) {
    console.log(`[homepage-bot] 👨 Human or non-homepage, skipping`);
    return;
  }

  console.log(`[homepage-bot] 🤖 Bot detected visiting homepage`);

  // Environment variables
  const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL');
  const supabaseKey = Deno.env.get('VITE_SUPABASE_KEY');
  const netlifyUrl = Deno.env.get('URL') || 'https://seo-vacancy.eu';

  if (!supabaseUrl || !supabaseKey) {
    console.log(`[homepage-bot] ❌ Missing Supabase credentials`);
    return new Response('Configuration error', {
      status: 500,
      headers: { 
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=300' 
      }
    });
  }

  try {
    const jobs = await getHomepageJobs(supabaseUrl, supabaseKey);
    const html = generateHomepageHTML(jobs, netlifyUrl);
    
    console.log(`[homepage-bot] ✅ Generated homepage with ${jobs.length} jobs`);
    console.log(`[homepage-bot] 💾 Cache expires in ${Math.round((CACHE_DURATION - (Date.now() - cacheTimestamp)) / (60 * 1000))} minutes`);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'X-Edge-Function': 'homepage-bot-prerender',
        'X-Jobs-Count': jobs.length.toString(),
        'X-Cache-Age': Math.round((Date.now() - cacheTimestamp) / 1000).toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=172800', // 24h + 48h stale
        'CDN-Cache-Control': 'public, max-age=43200', // 12h for CDN
        'Vary': 'User-Agent'
      }
    });

  } catch (error) {
    console.log(`[homepage-bot] ❌ Error generating homepage: ${error.message}`);
    return new Response('Error generating homepage', { 
      status: 500,
      headers: { 'Cache-Control': 'public, max-age=300' }
    });
  }
};

export const config = { path: "/" };