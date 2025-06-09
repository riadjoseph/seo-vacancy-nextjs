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

    // Extract bot type from user agent
    const botType = userAgent.toLowerCase().includes('googlebot') ? 'Google' :
                   userAgent.toLowerCase().includes('bingbot') ? 'Bing' :
                   userAgent.toLowerCase().includes('facebook') ? 'Facebook' :
                   userAgent.toLowerCase().includes('linkedin') ? 'LinkedIn' :
                   userAgent.toLowerCase().includes('twitter') ? 'Twitter' :
                   userAgent.toLowerCase().includes('gptbot') ? 'ChatGPT' :
                   userAgent.toLowerCase().includes('claude') ? 'Claude' :
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