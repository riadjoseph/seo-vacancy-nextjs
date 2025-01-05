import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Job } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobPostingForm from "./PostJob";

export default function MyJobs() {
  const { jobs } = useLoaderData() as { jobs: Job[] };
  const { toast } = useToast();
  const [showPostJobForm, setShowPostJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

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

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowPostJobForm(true);
  };

  const handleFormClose = () => {
    setShowPostJobForm(false);
    setEditingJob(null);
  };

  const handleFormSuccess = () => {
    setShowPostJobForm(false);
    setEditingJob(null);
    window.location.reload(); // Refresh to show updated data
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Button onClick={() => setShowPostJobForm(true)}>Post New Job</Button>
      </div>

      {showPostJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <JobPostingForm 
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
              initialData={editingJob}
            />
          </div>
        </div>
      )}

      {jobs?.length === 0 && !showPostJobForm ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No jobs posted yet</h2>
          <p className="text-gray-600">Start by posting your first job listing</p>
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
                {/* <Button 
                  variant="outline" 
                  onClick={() => handleEditJob(job)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button> */}
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