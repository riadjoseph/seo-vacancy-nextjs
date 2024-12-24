import { SeoSpecialization } from "@/data/types";

// Common keywords that should appear in job descriptions
const JOB_RELATED_KEYWORDS = [
  'experience', 'skills', 'requirements', 'responsibilities', 'team',
  'project', 'development', 'work', 'position', 'role', 'qualification',
  'background', 'knowledge', 'understanding', 'ability', 'years',
  'environment', 'opportunity', 'company', 'client', 'solution',
  'technology', 'software', 'application', 'system', 'platform'
];

const TECH_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'ruby', 'php',
  'react', 'angular', 'vue', 'node', 'express', 'django', 'flask',
  'spring', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'sql',
  'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'rest'
];

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

const calculateContentScore = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  
  // Check for job-related keywords
  const jobKeywordCount = JOB_RELATED_KEYWORDS.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;

  // Check for technical keywords in description
  const techKeywordCount = TECH_KEYWORDS.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;

  // Basic scoring system
  let score = 0;
  score += uniqueWords.size / words.length * 50; // Vocabulary diversity
  score += jobKeywordCount * 5; // Job context relevance
  score += techKeywordCount * 5; // Technical relevance
  score = Math.min(100, score); // Cap at 100

  return score;
}

const checkForSpamPatterns = (text: string): boolean => {
  const words = text.toLowerCase().split(/\s+/);
  
  // Check for excessive repetition
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // If any word appears more than 30% of the time, it's likely spam
  return Object.values(wordFrequency).some(count => 
    count > words.length * 0.3
  );
};

export const validateJobPost = (formData: JobFormData): ValidationResult => {
  const errors: Record<string, string> = {};
  let score = 0;

  // Title validation
  if (!formData.title.trim()) {
    errors.title = "Job title is required";
  } else {
    const titleScore = calculateContentScore(formData.title);
    if (titleScore < 30) {
      errors.title = "Please provide a more descriptive job title";
    }
    score += titleScore * 0.2; // Title contributes 20% to total score
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

    const descriptionScore = calculateContentScore(formData.description);
    if (descriptionScore < 40) {
      errors.description = "Please provide a more meaningful job description";
    }
    score += descriptionScore * 0.5; // Description contributes 50% to total score
  }

  // Tags validation
  if (!formData.tags || formData.tags.length === 0) {
    errors.tags = "Please select at least one SEO specialization";
  } else if (formData.tags.length > 5) {
    errors.tags = "Please select no more than 5 SEO specializations";
  }
  score += (formData.tags.length / 5) * 30; // Tags contribute 30% to total score

  // URL validation
  try {
    const url = new URL(formData.job_url);
    if (!url.hostname.includes('.')) {
      errors.job_url = "Please provide a valid application URL";
    }
  } catch {
    errors.job_url = "Please provide a valid application URL";
  }

  return {
    isValid: Object.keys(errors).length === 0 && score >= 60, // Require at least 60% quality score
    errors,
    score
  };
};
