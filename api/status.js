export default function handler(request, response) {
  // Get the status code from custom headers
  const status = request.headers['x-status'] || request.headers['data-status'];

  // Default to 404 if the URL matches a not found page
  const finalStatus = status ? parseInt(status) : 404;

  response.status(finalStatus).send('');
}