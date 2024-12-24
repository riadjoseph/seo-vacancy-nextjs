import JobCard from "@/components/JobCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBookmark } from "@/hooks/useBookmark";

const Bookmarks = () => {
  const { getBookmarks } = useBookmark();
  const bookmarkedIds = getBookmarks();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["bookmarked-jobs", bookmarkedIds],
    queryFn: async () => {
      if (bookmarkedIds.length === 0) return [];
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .in("id", bookmarkedIds);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="container py-8">Loading...</div>;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookmarked Jobs</h1>
      
      {jobs.length === 0 ? (
        <p className="text-gray-500">You haven't bookmarked any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;