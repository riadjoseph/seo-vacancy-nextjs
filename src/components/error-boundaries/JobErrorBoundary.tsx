import { useState, useEffect, ReactNode } from "react";
import { useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "@/pages/NotFound";
import ExpiredJobPage from "@/components/job/ExpiredJobPage";

const JobErrorBoundary = () => {
  const [content, setContent] = useState<ReactNode>(null);
  const error = useRouteError();

  useEffect(() => {
    const fetchExpiredJob = async () => {
      const jobId = window.location.pathname.split('/').pop();
      const statusCode = error instanceof Response ? error.status : 404;
      
      // Set Netlify status code header
      const headers = new Headers();
      headers.append("Netlify-CDN-Cache-Control", "no-cache");
      headers.append("X-Not-Found", "true");
      document.head.appendChild(Object.assign(document.createElement("meta"), {
        httpEquiv: "status",
        content: statusCode.toString()
      }));

      if (error instanceof Response && error.status === 410) {
        const { data } = await supabase
          .from("jobs")
          .select()
          .eq("id", jobId)
          .single();
        
        if (data) {
          setContent(
            <>
              <Helmet>
                <title>Job Expired | {data.title}</title>
                <meta name="robots" content="noindex" />
                <meta httpEquiv="Status" content="410" />
              </Helmet>
              <ExpiredJobPage job={data} />
            </>
          );
          return;
        }
      }
      
      setContent(<NotFound />);
    };

    fetchExpiredJob();
  }, [error]);

  return content;
};

export default JobErrorBoundary;