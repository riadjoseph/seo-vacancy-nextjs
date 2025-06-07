/**
 * hreflang-uk.js
 * 
 * Finds or falls back to the current page’s URL, swaps its domain
 * from seo-vacancy.eu → seo-vacancy.co.uk (preserving path/query/hash),
 * removes any existing en-GB alternate, and injects a fresh one.
 */
(function() {
  function addEnGbAlternate() {
    try {
      const head = document.head;
      if (!head) return; // no <head>, bail

      // Remove existing en-GB alternate links
      const existing = head.querySelectorAll('link[rel="alternate"][hreflang="en-GB"]');
      existing.forEach(el => head.removeChild(el));

      // Get canonical or fall back to current URL
      const canonEl = head.querySelector('link[rel="canonical"]');
      const srcUrl  = (canonEl && canonEl.href) ? canonEl.href : window.location.href;
      
      // Parse and swap domain
      const urlObj = new URL(srcUrl);
      // Only swap if current hostname matches source
      if (urlObj.hostname === 'seo-vacancy.eu') {
        urlObj.hostname = 'seo-vacancy.co.uk';
      } else {
        // If non-.eu, you can still force the .co.uk
        urlObj.hostname = 'seo-vacancy.co.uk';
      }
      
      // Create and append new alternate
      const altLink = document.createElement('link');
      altLink.setAttribute('rel', 'alternate');
      altLink.setAttribute('hreflang', 'en-GB');
      altLink.setAttribute('href', urlObj.toString());
      head.appendChild(altLink);
    } catch (err) {
      // Fail silently or log if you prefer
      console.error('hreflang-uk.js error:', err);
    }
  }

  // Ensure we run after the document is parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addEnGbAlternate);
  } else {
    addEnGbAlternate();
  }
})();