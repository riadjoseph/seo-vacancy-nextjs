import { useLoaderData, Link } from "react-router-dom";
import { Job } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function MyJobs() {
  const { jobs } = useLoaderData() as { jobs: Job[] };
  const { toast } = useToast();

  const handleDelete = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Button asChild>
          <Link to="/post-job">Post New Job</Link>
        </Button>
      </div>

      {jobs?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No jobs posted yet</h2>
          <p className="text-gray-600 mb-6">Start by posting your first job listing</p>
          <Button asChild>
            <Link to="/post-job">Post a Job</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs?.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                <CardDescription>{job.company_name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  Posted: {format(new Date(job.created_at!), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500">
                  Expires: {format(new Date(job.expires_at), 'MMM d, yyyy')}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Button variant="outline" asChild>
                  <Link to={`/edit-job/${job.id}`}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(job.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}