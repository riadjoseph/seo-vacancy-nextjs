import { SeoSpecialization } from "@/data/types";

export interface JobFormData {
  title: string;
  company_name: string;
  company_logo: string;
  description: string;
  tags: SeoSpecialization[];
  category: string;
  job_url: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  start_date: string;
  duration: string;
  city: string;
  hide_salary?: boolean;
  featured?: boolean;
}

export interface JobFormErrors {
  [key: string]: string;
}