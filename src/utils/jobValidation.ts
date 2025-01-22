import { SeoSpecialization } from "@/data/types";

// Common keywords that should appear in job descriptions
// const JOB_RELATED_KEYWORDS = [ ... ];

// const TECH_KEYWORDS = [ ... ];

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
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  score: number;
}

// const calculateContentScore = (text: string): number => { ... };

// const countKeywords = (text: string, keywords: string[]): number => { ... };

const checkForSpamPatterns = (text: string): boolean => {
  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency: Record<string, number> = {};

  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  return Object.values(wordFrequency).some(count => count > words.length * 0.3); // Check for excessive repetition
};

export const validateJobPost = (formData: JobFormData): ValidationResult => {
  const errors: Record<string, string> = {};
  let score = 0;

  // Title validation
  if (!formData.title.trim()) {
    errors.title = "Job title is required";
  } else {
    // const titleScore = calculateContentScore(formData.title);
    if (formData.title.length < 3) {
      errors.title = "Please provide a more descriptive job title";
    }
    score += 20; // Placeholder for title score
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

    // const descriptionScore = calculateContentScore(formData.description);
    if (formData.description.length < 100) {
      errors.description = "Please provide a more meaningful job description";
    }
    score += 50; // Placeholder for description score
  }

  // Tags validation
  if (!formData.tags || formData.tags.length === 0) {
    errors.tags = "Please select at least one SEO specialization";
  } else if (formData.tags.length > 5) {
    errors.tags = "Please select no more than 5 SEO specializations";
  }
  score += (formData.tags.length / 5) * 30; // Placeholder for tags score

  // URL validation
  try {
    const url = new URL(formData.job_url);
    if (!url.hostname.includes('.')) {
      errors.job_url = "Please provide a valid application URL";
    }
  } catch {
    errors.job_url = "Please provide a valid application URL";
  }

  const isValid = Object.keys(errors).length === 0 && score >= 60; // Placeholder for total score

  return {
    isValid,
    errors,
    score
  };
};

export const validateJobDescription = (text: string, tags: string[]): { isValid: boolean; score: number } => {
  let score = 0;
  
  // 1. Check minimum length
  if (text.length >= 100) {
    score += 20;
  }
  
  // 2. Check if tags are provided and valid
  if (tags && tags.length > 0) {
    score += tags.length * 10; // Give points for each tag
  }
  
  // 3. Check for basic formatting
  if (text.includes('\n')) {
    score += 10; // Reward structured content with line breaks
  }
  
  const isValid = score >= 30; // Adjust threshold as needed
  
  return { isValid, score };
};
