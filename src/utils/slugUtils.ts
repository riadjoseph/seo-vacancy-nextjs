// utils/slugUtils.ts

export function createJobSlug(title: string, company: string, city: string): string {
  // Clean and prepare each component
  const cleanTitle = (title || '').trim();
  const cleanCompany = (company || '').trim();
  const cleanCity = (city || '').trim();
  
  // Combine all parts
  const combined = `${cleanTitle}-${cleanCompany}-${cleanCity}`;
  
  // Create slug with proper cleaning
  const slug = combined
    .toLowerCase()
    // Replace common special characters with spaces first
    .replace(/[&]/g, ' and ')          // & → and
    .replace(/[+]/g, ' plus ')         // + → plus  
    .replace(/[%]/g, ' percent ')      // % → percent
    .replace(/[@]/g, ' at ')           // @ → at
    .replace(/[.]/g, ' ')              // . → space
    .replace(/[,]/g, ' ')              // , → space
    .replace(/[()\[\]]/g, ' ')         // brackets → space
    .replace(/['"]/g, '')              // Remove quotes entirely
    // Convert to dash-separated
    .replace(/[^a-z0-9]+/g, '-')       // Non-alphanumeric → dash
    .replace(/^-+|-+$/g, '')           // Remove leading/trailing dashes
    .replace(/-{2,}/g, '-');           // Multiple dashes → single dash
  
  return slug;
}

// Alternative: More conservative approach
export function createJobSlugConservative(title: string, company: string, city: string): string {
  const cleanPart = (text: string): string => {
    return (text || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')    // Keep only letters, numbers, spaces, dashes
      .replace(/\s+/g, '-')            // Spaces → dashes
      .replace(/-+/g, '-')             // Multiple dashes → single
      .replace(/^-+|-+$/g, '');        // Trim dashes
  };
  
  const titleSlug = cleanPart(title);
  const companySlug = cleanPart(company);
  const citySlug = cleanPart(city);
  
  return [titleSlug, companySlug, citySlug]
    .filter(part => part.length > 0)
    .join('-');
}

// Test function to verify slug generation
export function testSlugGeneration() {
  const testCases = [
    ['SEO Manager', 'Tech Corp.', 'New York'],
    ['Junior Developer (Remote)', 'A&S Adventure', 'Amsterdam'],
    ['Senior Engineer - Full Stack', 'Company, Inc.', 'San Francisco'],
    ['Marketing Lead', 'Start-up Ltd.', 'London, UK'],
    ['Data Scientist @ AI Corp', 'Tech & Innovation', 'Berlin/Munich']
  ];
  
  console.log('Slug Generation Tests:');
  testCases.forEach(([title, company, city]) => {
    const slug1 = createJobSlug(title, company, city);
    const slug2 = createJobSlugConservative(title, company, city);
    console.log(`Input: "${title}", "${company}", "${city}"`);
    console.log(`  Standard: ${slug1}`);
    console.log(`  Conservative: ${slug2}`);
    console.log('');
  });
}

// Utility to regenerate slug for existing job
export function regenerateJobSlug(job: { title?: string; company_name?: string; city?: string }): string {
  return createJobSlug(
    job.title || '',
    job.company_name || '',
    job.city || ''
  );
}

// Utility to validate slug uniqueness (use when creating jobs)
export async function ensureUniqueSlug(
  supabase: any, 
  baseSlug: string, 
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    // Check if slug exists
    let query = supabase
      .from('jobs')
      .select('id')
      .eq('slug', slug)
      .limit(1);
    
    // Exclude current job if updating
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.warn('Error checking slug uniqueness:', error.message);
      break;
    }
    
    // If no existing job has this slug, we're good
    if (!data || data.length === 0) {
      break;
    }
    
    // Try with counter suffix
    counter++;
    slug = `${baseSlug}-${counter}`;
    
    // Safety limit
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }
  
  return slug;
}