export default function handler(request, response) {
  // Get the status code from the X-Status header
  const status = request.headers['x-status'] || 200;
  
  // Send response with the correct status code
  response.status(parseInt(status)).send('');
}