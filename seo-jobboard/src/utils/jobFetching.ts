import { supabase } from "@/integrations/supabase/client";

export const fetchJob = async (jobId: string) => {
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) throw error;
  return job;
};