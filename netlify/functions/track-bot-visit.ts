// netlify/functions/track-bot-visit.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  // CORS headers for tracking pixel
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  try {
    const { job, bot, prerendered } = event.queryStringParameters || {};
    const userAgent = event.headers['user-agent'] || '';
    const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || '';

    // Extract bot type from user agent with comprehensive detection
    const userAgentLower = userAgent.toLowerCase();
    
    const botType = 
      // Google bots
      userAgentLower.includes('googlebot') || userAgentLower.includes('google-inspectiontool') || 
      userAgentLower.includes('google') && userAgentLower.includes('bard') ? 'Google' :
      
      // Microsoft/Bing bots
      userAgentLower.includes('bingbot') || userAgentLower.includes('bnnqpt') ? 'Bing' :
      
      // Social media bots
      userAgentLower.includes('facebook') ? 'Facebook' :
      userAgentLower.includes('linkedin') ? 'LinkedIn' :
      userAgentLower.includes('twitter') ? 'Twitter' :
      
      // AI bots
      userAgentLower.includes('gptbot') || userAgentLower.includes('chatgpt') || 
      userAgentLower.includes('openai') ? 'ChatGPT' :
      userAgentLower.includes('claude') ? 'Claude' :
      userAgentLower.includes('gemini') || userAgentLower.includes('bard') ? 'Gemini' :
      userAgentLower.includes('copilot') ? 'Copilot' :
      
      // Content/Writing AI bots
      userAgentLower.includes('writesonic') ? 'Writesonic' :
      userAgentLower.includes('copy.ai') ? 'Copy.AI' :
      userAgentLower.includes('neeva') ? 'Neeva' :
      
      // SEO/Analysis bots
      userAgentLower.includes('astatic') ? 'Astatic' :
      userAgentLower.includes('outrider') ? 'Outrider' :
      userAgentLower.includes('perplexity') ? 'Perplexity' :
      userAgentLower.includes('edgeservices') ? 'EdgeServices' :
      userAgentLower.includes('nimble') ? 'Nimble' :
      
      // Catch remaining AI patterns
      userAgentLower.includes('ai.') || userAgentLower.includes('.ai') ? 'AI Bot' :
      userAgentLower.includes('gpt.') || userAgentLower.includes('.gpt') ? 'GPT Bot' :
      
      // Default
      'Other';

    // Store the visit in Supabase
    await supabase
      .from('bot_visits')
      .insert({
        job_slug: job,
        bot_type: botType,
        user_agent: userAgent,
        ip_address: ip.split(',')[0], // First IP if multiple
        prerendered: prerendered === 'true',
        visited_at: new Date().toISOString(),
        referrer: event.headers.referer || null
      });

    console.log(`🤖 Bot visit tracked: ${botType} viewed ${job}`);

    // Return a 1x1 transparent GIF
    const gif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return {
      statusCode: 200,
      headers,
      body: gif.toString('base64'),
      isBase64Encoded: true
    };

  } catch (error) {
    console.error('Bot tracking error:', error);
    
    // Still return a valid GIF even on error
    const gif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return {
      statusCode: 200,
      headers,
      body: gif.toString('base64'),
      isBase64Encoded: true
    };
  }
};