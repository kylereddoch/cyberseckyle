const defaultApiUrl = 'https://cyberseckyle-newsletter-api.kylereddoch.workers.dev';
const defaultTurnstileSiteKey = '0x4AAAAAAECJJ2X69XMhEeLK';

const apiUrl = String(process.env.NEWSLETTER_API_URL || defaultApiUrl)
  .trim()
  .replace(/\/+$/, '');
const turnstileSiteKey = String(
  process.env.TURNSTILE_SITE_KEY || defaultTurnstileSiteKey
).trim();

export default {
  apiUrl,
  turnstileSiteKey,
  configured: Boolean(apiUrl && turnstileSiteKey)
};
