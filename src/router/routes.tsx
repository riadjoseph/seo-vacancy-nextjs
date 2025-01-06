import { Navigate } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import App from '@/App';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import JobDetails from '@/pages/JobDetails';
import Bookmarks from '@/pages/Bookmarks';
import CityJobs from '@/pages/CityJobs';
import TagJobs from '@/pages/TagJobs';
import MyJobs from '@/pages/MyJobs';
import NotFoundBoundary from '@/components/error-boundaries/NotFoundBoundary';
import JobErrorBoundary from '@/components/error-boundaries/JobErrorBoundary';
import { supabase } from "@/integrations/supabase/client";
import ResetPassword from '@/pages/ResetPassword';
import UpdatePassword from '@/pages/UpdatePassword';
import MagicLink from '@/pages/MagicLink';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import NotFound from "@/pages/NotFound";

// Helper functions
const containsSpaces = (str: string) => /\s|%20/.test(str);
const normalizeTag = (tag: string) => tag.toLowerCase().replace(/-/g, ' ');

const createJobSlug = (title: string, company: string, city: string) => {
  const slug = `${title}-${company}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug;
};

// Centralized session check
const requireAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session;
};

// Route loaders
const indexLoader = async () => {
  const { data } = await supabase.from("jobs").select("*");
  return { jobs: data };
};

const jobDetailsLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const { data, error } = await supabase.from("jobs").select("*");

  if (error || !data) {
    throw new Response("Not Found", { status: 404 });
  }

  const job = data.find(job => {
    const jobSlug = createJobSlug(job.title, job.company_name, job.city || 'Remote');
    return jobSlug === params.slug;
  });

  if (!job) {
    throw new Response("Not Found", { status: 404 });
  }

  const isExpired = new Date(job.expires_at) < new Date();

  if (isExpired) {
    throw new Response("Gone", {
      status: 410,
      headers: {
        "X-Response-Type": "expired-job",
      },
    });
  }

  return { job, isExpired: false };
};

const cityJobsLoader = async ({ params }: LoaderFunctionArgs) => {
  const searchCity = decodeURIComponent(params.city || '').toLowerCase();

  const { data } = await supabase.from("jobs").select("*").ilike('city', searchCity);

  if (!data || data.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  return { jobs: data };
};

const tagJobsLoader = async ({ params }: LoaderFunctionArgs) => {
  if (containsSpaces(params.tag || '')) {
    throw new Response("Not Found", { status: 404 });
  }

  const { data } = await supabase.from("jobs").select("*");

  const searchTag = normalizeTag(decodeURIComponent(params.tag || ''));

  const filteredJobs = data?.filter(job =>
    job.tags.some((tag: string) =>
      normalizeTag(tag) === searchTag
    )
  );

  if (!filteredJobs || filteredJobs.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  return { jobs: filteredJobs };
};

const myJobsLoader = async () => {
  const session = await requireAuth();
  const { user } = session;

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { jobs };
};

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundBoundary />,
    children: [
      {
        index: true,
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "my-jobs",
        element: <MyJobs />,
        loader: myJobsLoader,
        errorElement: <NotFoundBoundary />,
      },
      {
        path: "job/:slug",
        element: <JobDetails />,
        loader: jobDetailsLoader,
        errorElement: <JobErrorBoundary />,
      },
      {
        path: "bookmarks",
        element: <Bookmarks />,
      },
      {
        path: "jobs/city/:city",
        element: <CityJobs />,
        loader: cityJobsLoader,
        errorElement: <NotFoundBoundary />,
      },
      {
        path: "jobs/tag/:tag",
        element: <TagJobs />,
        loader: tagJobsLoader,
        errorElement: <NotFoundBoundary />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
        errorElement: <NotFoundBoundary />
      },
      {
        path: "/update-password",
        element: <UpdatePassword />,
        errorElement: <NotFoundBoundary />
      },
      {
        path: "/magic-link",
        element: <MagicLink />,
        errorElement: <NotFoundBoundary />
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];