import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from './router/routes';
import './index.css';

// Add event listener for HTTP status code
window.addEventListener('httpStatus', (event: any) => {
  const statusCode = event.detail;
  // This will be picked up by the server to set the actual HTTP status code
  document.documentElement.dataset.status = statusCode.toString();
});

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);