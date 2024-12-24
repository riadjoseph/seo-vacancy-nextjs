import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import JobCard from "../JobCard";
import { useBookmark } from "@/hooks/useBookmark";

const BookmarksSheet = () => {
  const { getBookmarks } = useBookmark();
  const bookmarkedIds = getBookmarks();

  const { data: bookmarkedJobs = [], isLoading } = useQuery({
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          <span className="hidden sm:inline">My Bookmarks</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>My Bookmarked Jobs</SheetTitle>
          <SheetDescription>
            View and manage your saved job listings
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-4 overflow-y-auto max-h-[80vh]">
          {isLoading ? (
            <p>Loading bookmarks...</p>
          ) : bookmarkedJobs.length === 0 ? (
            <p className="text-gray-500">You haven't bookmarked any jobs yet.</p>
          ) : (
            bookmarkedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookmarksSheet;