export function createTagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/&/g, 'and') // Replace & with "and"
    .replace(/[\/\\#,+()$~%.'":*?<>{}]/g, '') // Remove other special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/(^-|-$)/g, '') // Remove leading/trailing hyphens
}

export function parseTagFromSlug(slug: string): string {
  // Create a mapping for accurate reverse conversion
  const tagMappings: { [key: string]: string } = {
    'local-seo': 'Local SEO',
    'e-commerce-seo': 'E-commerce SEO',
    'enterprise-seo': 'Enterprise SEO',
    'analytics-and-data-seo': 'Analytics & Data SEO',
    'international-seo': 'International SEO',
    'content-seo': 'Content SEO',
    'seo-strategy-and-management': 'SEO Strategy & Management',
    'technical-seo': 'Technical SEO',
    'link-building': 'Link Building'
  }
  
  // Return exact mapping if found
  if (tagMappings[slug]) {
    return tagMappings[slug]
  }
  
  // Fallback: basic conversion
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/Seo/g, 'SEO')
    .replace(/Geo/g, 'GEO')
}