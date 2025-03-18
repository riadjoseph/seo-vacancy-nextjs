// This is a Netlify function that properly sets HTTP status codes
export default function handler(request, response) {
  // Check URL path for 404 indicators
  const path = request.path || request.url || '';
  const is404Path = path.endsWith('404.html') || path.includes('/404');
  
  // Get status from headers
  const headerStatus = 
    request.headers['x-status'] || 
    request.headers['data-status'];
  
  // Get status from document if available
  const docStatus = request.documentElement?.dataset?.status;
  
  // Determine final status code (with priority)
  let statusCode = 200;
  
  if (headerStatus) {
    statusCode = parseInt(headerStatus, 10);
  } else if (docStatus) {
    statusCode = parseInt(docStatus, 10);
  } else if (is404Path) {
    statusCode = 404;
  }
  
  // Log for debugging
  console.log(`Setting status code: ${statusCode} for path: ${path}`);
  
  // Send response with the correct status code
  response.status(statusCode).send('');
}
