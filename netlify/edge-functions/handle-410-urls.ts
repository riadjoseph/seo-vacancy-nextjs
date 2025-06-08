// netlify/edge-functions/handle-410-urls.ts

// Cache for the 410 URLs to avoid reading the file on every request
let cached410Urls: Set<string> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function get410Urls(): Promise<Set<string>> {
  const now = Date.now();
  
  // Return cached URLs if cache is still valid
  if (cached410Urls && (now - cacheTimestamp) < CACHE_DURATION) {
    return cached410Urls;
  }

  try {
    // Fetch the 410-urls.txt file from your site
    const response = await fetch(`${Deno.env.get('URL')}/410-urls.txt`);
    
    if (!response.ok) {
      console.warn('Could not fetch 410-urls.txt file');
      return new Set();
    }

    const text = await response.text();
    const urls = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
      .map(url => {
        // Normalize URLs - remove protocol and domain if present
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
    cacheTimestamp = now;
    
    console.log(`Loaded ${urls.length} URLs for 410 status`);
    return cached410Urls;
    
  } catch (error) {
    console.error('Error loading 410 URLs:', error);
    return cached410Urls || new Set();
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Get the list of URLs that should return 410
  const urls410 = await get410Urls();

  // Check if current path should return 410
  if (urls410.has(pathname)) {
    console.log(`Returning 410 for: ${pathname}`);
    
    return new Response(
      `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta property="og:image" content="/seo-job-board.svg" />
  <link rel="icon" type="image/svg+xml" href="/seo-job-board.svg" />
  <script type="module" crossorigin src="/assets/index-2XpiOrJT.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-MSQvmgUS.css">
</head>

<body>
    <div class="container max-w-2xl mx-auto py-12 px-4">
      <div class="text-center space-y-6">
        <div class="space-y-4">
          <h1 class="text-4xl font-bold text-gray-900">That Page is Gone</h1>
          <p class="text-xl text-gray-600">Sorry, we couldn't find the page you're looking for.</p></div><div class="flex justify-center gap-4 mt-8"><a class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" href="/">Check Other Job Openings</a></div></div></div>
</body>

</html>`,
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=86400', // Cache 410 responses for 1 day
        },
      }
    );
  }

  // If URL is not in the 410 list, continue with normal processing
  return context.next();
};

export const config = {
  // Run this edge function for all requests
  path: "/*",
};