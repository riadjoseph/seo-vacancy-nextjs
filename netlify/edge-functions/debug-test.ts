// netlify/edge-functions/debug-test.ts

export default async (request: Request) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    path: url.pathname,
    userAgent: userAgent,
    isBot: userAgent.toLowerCase().includes('bot'),
    supabaseUrl: Deno.env.get('VITE_SUPABASE_URL') ? 'Set' : 'Missing',
    supabaseKey: Deno.env.get('VITE_SUPABASE_KEY') ? 'Set' : 'Missing', // Changed to match your variable name
    netlifyUrl: Deno.env.get('URL') || 'Missing'
  };

  return new Response(JSON.stringify(debugInfo, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Function': 'true'
    }
  });
};

export const config = {
  path: "/debug-edge"
};