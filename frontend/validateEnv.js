import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
// validateEnv.js
const requiredEnvVars = [
    'APP_ENV',
    'SANITY_PROJECT_ID',
    'SANITY_PROJECT_DATASET',
    'NUXT_PUBLIC_SITE_URL',
  ];
  
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  const publicUrl = process.env['NUXT_PUBLIC_SITE_URL'];
  const publicUrlIsDev = publicUrl && (publicUrl.includes('netlify.app') || publicUrl.includes('vercel.app') || publicUrl.includes('pages.dev'));
  const isProduction = process.env['APP_ENV'] && process.env['APP_ENV'] === 'production';

  if (missingEnvVars.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1); // Exit with a failure code
  }
  if (!isProduction) {
    console.warn(`WARNING: SITE WON'T INDEX because APP_ENV is not set to 'production'`);
  }

  if (publicUrlIsDev) {
    console.warn(`WARNING: SITE WON'T INDEX, NUXT_PUBLIC_SITE_URL cannot be a Netlify, Cloudflare Pages or Vercel URL for SEO reasons`);
  }
