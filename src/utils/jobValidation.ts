import { SeoSpecializationOption } from "@/data/types";

export interface JobFormData {
  title: string;
  company_name: string;
  company_logo: string;
  description: string;
  tags: SeoSpecializationOption[];
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

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  score: number;
}

const checkForSpamPatterns = (text: string): boolean => {
  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency: Record<string, number> = {};

  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  return Object.values(wordFrequency).some(count => count > words.length * 0.3);
};

export const validateJobPost = (formData: JobFormData): ValidationResult => {
  const errors: Record<string, string> = {};
  let score = 0;

  // Title validation
  if (!formData.title.trim()) {
    errors.title = "Job title is required";
  } else {
    if (formData.title.length < 3) {
      errors.title = "Please provide a more descriptive job title";
    }
    score += 20;
  }

  // Company name validation
  if (!formData.company_name.trim()) {
    errors.company_name = "Company name is required";
  } else {
    score += 10;
  }

  // Category validation
  if (!formData.category.trim()) {
    errors.category = "Please select a job category";
  } else {
    score += 10;
  }

  // City validation
  if (!formData.city.trim()) {
    errors.city = "Please select a location";
  } else {
    score += 10;
  }

  // Description validation
  if (!formData.description.trim()) {
    errors.description = "Job description is required";
  } else {
    const words = formData.description.trim().split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    if (uniqueWords.size < 50) {
      errors.description = "Please provide a more detailed job description (at least 50 unique words)";
    }
    
    if (checkForSpamPatterns(formData.description)) {
      errors.description = "Please avoid repetitive content in the description";
    }

    if (formData.description.length < 100) {
      errors.description = "Please provide a more meaningful job description";
    }
    score += 30;
  }

  // Tags validation
  if (!formData.tags || formData.tags.length === 0) {
    errors.tags = "Please select at least one specialization";
  } else if (formData.tags.length > 5) {
    errors.tags = "Please select no more than 5 specializations";
  } else {
    score += (formData.tags.length / 5) * 20;
  }

  // URL validation
  if (!formData.job_url.trim()) {
    errors.job_url = "Application URL is required";
  } else {
    try {
      const url = new URL(formData.job_url);
      if (!url.hostname.includes('.')) {
        errors.job_url = "Please provide a valid application URL";
      }
    } catch {
      errors.job_url = "Please provide a valid application URL";
    }
  }

  const isValid = Object.keys(errors).length === 0 && score >= 60;

  return {
    isValid,
    errors,
    score
  };
};

export const validateJobDescription = (text: string, tags: string[]): { isValid: boolean; score: number } => {
  let score = 0;
  
  if (text.length >= 100) {
    score += 20;
  }
  
  if (tags && tags.length > 0) {
    score += tags.length * 10;
  }
  
  if (text.includes('\n')) {
    score += 10;
  }
  
  const isValid = score >= 30;
  
  return { isValid, score };
};