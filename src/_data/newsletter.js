const defaultApiUrl = 'https://cyberseckyle-newsletter-api.kylereddoch.workers.dev';
const defaultTurnstileSiteKey = '0x4AAAAAAECJJ2X69XMhEeLK';
const turnstileTestSiteKey = '1x00000000000000000000AA';
const previewMode = process.env.ELEVENTY_ENV === 'development' && !process.env.NEWSLETTER_API_URL;

const apiUrl = String(process.env.NEWSLETTER_API_URL || defaultApiUrl)
  .trim()
  .replace(/\/+$/, '');
const turnstileSiteKey = String(
  process.env.TURNSTILE_SITE_KEY || (previewMode ? turnstileTestSiteKey : defaultTurnstileSiteKey)
).trim();

export default {
  apiUrl,
  turnstileSiteKey,
  previewMode,
  configured: Boolean(apiUrl && turnstileSiteKey)
};
