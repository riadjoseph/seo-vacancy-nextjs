export type Job = {
  id: string;
  title: string;
  company_name: string;
  company_logo: string;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  category: string;
  featured: boolean;
  job_url: string;
  bookmarks: number;
  created_at?: string;
  expires_at?: string;
  posted_date?: string;
  start_date?: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency?: string;
  city?: string | null;
  hide_salary?: boolean;
};

export const SEO_SPECIALIZATIONS = [
  'Technical SEO',
  'Content SEO',
  'Local SEO',
  'E-commerce SEO',
  'International SEO',
  'Enterprise SEO',
  'Link Building',
  'SEO Strategy & Management',
  'Analytics & Data SEO'
] as const;

export type SeoSpecialization = typeof SEO_SPECIALIZATIONS[number];