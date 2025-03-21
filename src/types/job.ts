import { SeoSpecialization } from "@/data/types";

export interface JobFormData {
  id?: string;
  title: string;
  company_name: string;
  company_logo: string;
  description: string;
  tags: SeoSpecialization[];
  category: string;
  job_url: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  start_date: string;
  duration?: string;
  city: string;
  hide_salary?: boolean;
  featured?: boolean;
  bookmarks?: number;
  created_at?: string;
  expires_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface JobFormErrors {
  [key: string]: string;
}