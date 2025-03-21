// This is a Netlify function that properly sets HTTP status codes
export default function handler(request, response) {
  // Check URL path for 404 indicators
  const path = request.path || request.url || '';
  const is404Path = path.endsWith('404.html') || path.includes('/404');
  
  // Get status from Netlify's meta tag header
  const headerStatus = request.headers['x-netlify-status'];
  
  // Determine final status code (with priority)
  let statusCode = 200;
  
  if (headerStatus) {
    statusCode = parseInt(headerStatus, 10);
  } else if (is404Path) {
    statusCode = 404;
  }
  
  // Log for debugging
  console.log(`Setting status code: ${statusCode} for path: ${path}`);
  
  // Send response with the correct status code
  response.status(statusCode).send('');
}
