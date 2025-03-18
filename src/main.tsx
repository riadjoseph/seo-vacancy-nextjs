import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from './router/routes';
import './index.css';

// Add event listener for HTTP status code
window.addEventListener('httpStatus', (event: any) => {
  const statusCode = event.detail;
  console.log(`Setting HTTP status: ${statusCode}`);
  
  // Set in HTML data attribute (picked up by Netlify)
  document.documentElement.dataset.status = statusCode.toString();
  
  // Set as a meta tag (additional way for Netlify to detect)
  let metaStatus = document.querySelector('meta[name="netlify:status"]');
  if (!metaStatus) {
    metaStatus = document.createElement('meta');
    metaStatus.setAttribute('name', 'netlify:status');
    document.head.appendChild(metaStatus);
  }
  metaStatus.setAttribute('content', statusCode.toString());
});

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
