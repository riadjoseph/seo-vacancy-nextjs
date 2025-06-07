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
<html>
<head>
    <title>410 - Gone</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>410 - Gone</h1>
    <p>The requested resource is no longer available and will not be available again.</p>
    <p>This is a permanent condition.</p>
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