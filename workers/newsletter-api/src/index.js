const DEFAULT_SITE_ORIGIN = 'https://www.kylereddoch.me';
const DEFAULT_RESEND_API_BASE_URL = 'https://api.resend.com';
const DEFAULT_TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const CONFIRMATION_TTL_SECONDS = 24 * 60 * 60;
const RESEND_COOLDOWN_SECONDS = 15 * 60;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 8;
const SUBMISSION_DEDUPE_TTL_SECONDS = 24 * 60 * 60;
const MAX_REQUEST_BYTES = 8 * 1024;
const SUBMISSION_CATEGORIES = new Map([
  ['cybersecurity', 'Cybersecurity'],
  ['vulnerabilities', 'Vulnerabilities and exploits'],
  ['privacy', 'Privacy'],
  ['identity', 'Identity and access'],
  ['cloud', 'Cloud security'],
  ['it-operations', 'IT operations'],
  ['msp', 'MSP'],
  ['ai', 'AI and security'],
  ['tools-research', 'Tools and research'],
  ['other', 'Other']
]);
const CREDIT_PREFERENCES = new Map([
  ['name', 'Credit my name'],
  ['handle', 'Credit my online handle'],
  ['anonymous', 'Keep my submission anonymous']
]);
const RELATIONSHIPS = new Map([
  ['none', 'No relationship'],
  ['author', 'I am the author or a contributor'],
  ['employer', 'My employer is involved'],
  ['vendor', 'I represent the vendor or organization'],
  ['client', 'A client or customer is involved'],
  ['other', 'Other relationship']
]);

class ServiceError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

const normalizeEmail = value => String(value || '').trim().toLowerCase();
const normalizeName = value => String(value || '').trim().replace(/\s+/g, ' ');
const normalizeInlineText = (value, maxLength) =>
  String(value || '')
    .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
const normalizeLongText = (value, maxLength) =>
  String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f<>]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);

const isValidEmail = email =>
  email.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeArticleUrl = value => {
  const candidate = String(value || '').trim();
  if (!candidate || candidate.length > 2048) return '';

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    if (url.username || url.password || !url.hostname) return '';
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
};

const sanitizePath = value => {
  const path = String(value || '').trim();
  if (!path.startsWith('/') || path.startsWith('//')) return '/newsletter/';
  return path.slice(0, 256);
};

const getAllowedOrigin = (request, env) => {
  const origin = request.headers.get('origin');
  if (!origin) return '';

  const configuredOrigins = String(env.SITE_ORIGIN || DEFAULT_SITE_ORIGIN)
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

  return configuredOrigins.includes(origin) || isLocal ? origin : null;
};

const buildHeaders = (request, env, contentType = '') => {
  const headers = new Headers({
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff'
  });
  const allowedOrigin = getAllowedOrigin(request, env);

  if (contentType) headers.set('content-type', contentType);
  if (allowedOrigin) {
    headers.set('access-control-allow-origin', allowedOrigin);
    headers.set('access-control-allow-methods', 'GET, POST, OPTIONS');
    headers.set('access-control-allow-headers', 'Accept, Content-Type');
    headers.set('access-control-max-age', '86400');
    headers.set('vary', 'Origin');
  }

  return headers;
};

const jsonResponse = (request, env, body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: buildHeaders(request, env, 'application/json; charset=utf-8')
  });

const redirectResponse = (location, status = 302) =>
  new Response(null, {
    status,
    headers: {
      location,
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff'
    }
  });

const hasRequiredConfiguration = env =>
  Boolean(
    env.RESEND_API_KEY &&
      env.TURNSTILE_SECRET_KEY &&
      env.NEWSLETTER_TOPIC_ID &&
      env.CONFIRM_TEMPLATE_ID &&
      env.NEWSLETTER_DATA?.get &&
      env.NEWSLETTER_DATA?.put &&
      env.NEWSLETTER_DATA?.delete
  );

const hasRequiredSubmissionConfiguration = env =>
  Boolean(
    env.RESEND_API_KEY &&
      env.TURNSTILE_SECRET_KEY &&
      env.SUBMISSION_ACK_TEMPLATE_ID &&
      env.SUBMISSION_NOTIFY_TO &&
      env.NEWSLETTER_DATA?.get &&
      env.NEWSLETTER_DATA?.put
  );

const toBase64Url = bytes => {
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const randomToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
};

const sha256 = async value => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(digest));
};

const kvGetJson = async (env, key) => {
  try {
    return await env.NEWSLETTER_DATA.get(key, { type: 'json' });
  } catch {
    return null;
  }
};

const kvPutJson = (env, key, value, expirationTtl) =>
  env.NEWSLETTER_DATA.put(key, JSON.stringify(value), { expirationTtl });

const parseJsonBody = async request => {
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_REQUEST_BYTES) {
    throw new ServiceError('The request is too large.', 413);
  }

  const raw = await request.text();
  if (raw.length > MAX_REQUEST_BYTES) {
    throw new ServiceError('The request is too large.', 413);
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new ServiceError('The request body must be valid JSON.', 400);
  }
};

const verifyTurnstile = async (request, env, token, expectedAction) => {
  if (!token) return false;

  const body = new URLSearchParams({
    secret: String(env.TURNSTILE_SECRET_KEY),
    response: token
  });
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await fetch(
    String(env.TURNSTILE_VERIFY_URL || DEFAULT_TURNSTILE_VERIFY_URL),
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body
    }
  );

  if (!response.ok) return false;
  const result = await response.json();
  const expectedHostname = String(env.TURNSTILE_EXPECTED_HOSTNAME || '').trim();
  const hostnameMatches = !expectedHostname || result.hostname === expectedHostname;

  return result.success === true &&
    result.action === expectedAction &&
    hostnameMatches;
};

const enforceRateLimit = async (request, env, scope) => {
  const identifier =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  const key = `rate:${scope}:${await sha256(identifier)}`;
  const now = Date.now();
  const current = await kvGetJson(env, key);
  const withinWindow = current?.resetAt > now;
  const next = {
    count: withinWindow ? Number(current.count || 0) + 1 : 1,
    resetAt: withinWindow ? current.resetAt : now + RATE_LIMIT_WINDOW_SECONDS * 1000
  };

  await kvPutJson(env, key, next, RATE_LIMIT_WINDOW_SECONDS);
  return next.count <= RATE_LIMIT_MAX_REQUESTS;
};

const resendRequest = async (env, path, options = {}) => {
  const baseUrl = String(env.RESEND_API_BASE_URL || DEFAULT_RESEND_API_BASE_URL).replace(/\/+$/, '');
  const headers = new Headers(options.headers || {});
  headers.set('authorization', `Bearer ${env.RESEND_API_KEY}`);
  headers.set('content-type', 'application/json');

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new ServiceError(`Resend request failed with status ${response.status}.`);
    error.upstreamStatus = response.status;
    error.upstreamPayload = payload;
    throw error;
  }

  return payload;
};

const getContact = async (env, identifier) => {
  try {
    return await resendRequest(env, `/contacts/${encodeURIComponent(identifier)}`);
  } catch (error) {
    if (error.upstreamStatus === 404) return null;
    throw error;
  }
};

const getContactTopics = async (env, identifier) => {
  const result = await resendRequest(
    env,
    `/contacts/${encodeURIComponent(identifier)}/topics`
  );
  return Array.isArray(result.data) ? result.data : [];
};

const ensurePendingContact = async (env, details) => {
  const properties = {
    signup_source: 'website',
    signup_path: details.signupPath,
    primary_interest: 'cybersecurity-it-msp',
    founding_reader: details.foundingReader
  };
  let contact = await getContact(env, details.email);

  if (!contact) {
    try {
      contact = await resendRequest(env, '/contacts', {
        method: 'POST',
        body: JSON.stringify({
          email: details.email,
          first_name: details.firstName || undefined,
          unsubscribed: true,
          properties
        })
      });
      return { contact, alreadyActive: false };
    } catch (error) {
      if (error.upstreamStatus !== 409) throw error;
      contact = await getContact(env, details.email);
    }
  }

  const update = { properties };
  if (details.firstName) update.first_name = details.firstName;
  await resendRequest(env, `/contacts/${encodeURIComponent(details.email)}`, {
    method: 'PATCH',
    body: JSON.stringify(update)
  });

  const topics = await getContactTopics(env, details.email);
  const newsletterTopic = topics.find(topic => topic.id === env.NEWSLETTER_TOPIC_ID);
  const alreadyActive =
    contact?.unsubscribed === false &&
    newsletterTopic?.subscription === 'opt_in';

  return { contact, alreadyActive };
};

const isFoundingReader = env => {
  const cutoff = String(env.FOUNDING_READER_CUTOFF || '').trim();
  if (!cutoff) return 'false';
  const cutoffTime = Date.parse(cutoff);
  return Number.isFinite(cutoffTime) && Date.now() <= cutoffTime ? 'true' : 'false';
};

const sendConfirmationEmail = async (env, email, confirmationUrl, idempotencyKey) =>
  resendRequest(env, '/emails', {
    method: 'POST',
    headers: {
      'idempotency-key': idempotencyKey
    },
    body: JSON.stringify({
      to: [email],
      template: {
        id: env.CONFIRM_TEMPLATE_ID,
        variables: {
          CONFIRMATION_URL: confirmationUrl
        }
      }
    })
  });

const genericAcceptedResponse = (request, env) =>
  jsonResponse(
    request,
    env,
    {
      ok: true,
      message: 'If the address can be subscribed, a confirmation email will arrive shortly.'
    },
    202
  );

const escapeHtml = value =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const htmlWithLineBreaks = value => escapeHtml(value).replace(/\n/g, '<br>');

const buildSubmissionNotificationHtml = details => {
  const articleUrl = escapeHtml(details.articleUrl);
  const disclosure = [
    `Relationship: ${details.relationshipLabel}`,
    details.disclosure || 'No additional disclosure provided.'
  ].join('\n');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
  </head>
  <body style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;background-color:#11111b;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#11111b" style="width:100%;background-color:#11111b;">
      <tr>
        <td align="center" bgcolor="#11111b" style="background-color:#11111b;padding-top:32px;padding-right:16px;padding-bottom:32px;padding-left:16px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#1e1e2e" style="width:100%;max-width:600px;background-color:#1e1e2e;border-top-left-radius:14px;border-top-right-radius:14px;border-bottom-right-radius:14px;border-bottom-left-radius:14px;overflow:hidden;">
            <tr>
              <td bgcolor="#cba6f7" style="background-color:#cba6f7;font-size:2px;line-height:2px;height:2px;width:34%;">&nbsp;</td>
              <td bgcolor="#89b4fa" style="background-color:#89b4fa;font-size:2px;line-height:2px;height:2px;width:33%;">&nbsp;</td>
              <td bgcolor="#74c7ec" style="background-color:#74c7ec;font-size:2px;line-height:2px;height:2px;width:33%;">&nbsp;</td>
            </tr>
            <tr>
              <td colspan="3" align="center" bgcolor="#120f2c" style="background-color:#120f2c;padding-top:12px;padding-right:24px;padding-bottom:12px;padding-left:24px;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#313244;">
                <img src="https://www.kylereddoch.me/assets/images/cyberseckyle-newsletter-logo-horizontal.png" width="360" height="136" border="0" alt="CybersecKyle — cybersecurity, IT, and MSP" style="display:block;width:100%;max-width:360px;height:auto;border-top-width:0;border-right-width:0;border-bottom-width:0;border-left-width:0;">
              </td>
            </tr>
            <tr>
              <td colspan="3" bgcolor="#1e1e2e" style="background-color:#1e1e2e;padding-top:34px;padding-right:36px;padding-bottom:36px;padding-left:36px;">
                <p style="margin-top:0;margin-right:0;margin-bottom:12px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#a6e3a1;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">New Community Signal · ${escapeHtml(details.categoryLabel)}</p>
                <h1 style="margin-top:0;margin-right:0;margin-bottom:20px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:36px;color:#cdd6f4;font-weight:bold;">${escapeHtml(details.headline)}</h1>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#313244" style="width:100%;background-color:#313244;border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;margin-bottom:16px;">
                  <tr>
                    <td bgcolor="#313244" style="background-color:#313244;padding-top:18px;padding-right:20px;padding-bottom:18px;padding-left:20px;">
                      <p style="margin-top:0;margin-right:0;margin-bottom:6px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#cba6f7;font-weight:bold;letter-spacing:0.7px;text-transform:uppercase;">Submitted article</p>
                      <p style="margin-top:0;margin-right:0;margin-bottom:6px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#bac2de;">Source: ${escapeHtml(details.source || 'Not provided')}</p>
                      <p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#89b4fa;"><a href="${articleUrl}" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#89b4fa;text-decoration:underline;">${articleUrl}</a></p>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#181825" style="width:100%;background-color:#181825;border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;margin-bottom:16px;">
                  <tr>
                    <td bgcolor="#181825" style="background-color:#181825;padding-top:18px;padding-right:20px;padding-bottom:18px;padding-left:20px;">
                      <p style="margin-top:0;margin-right:0;margin-bottom:7px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#74c7ec;font-weight:bold;letter-spacing:0.7px;text-transform:uppercase;">Why it matters</p>
                      <p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#bac2de;">${htmlWithLineBreaks(details.whyItMatters)}</p>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#313244" style="width:100%;background-color:#313244;border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;margin-bottom:16px;">
                  <tr>
                    <td bgcolor="#313244" style="background-color:#313244;padding-top:18px;padding-right:20px;padding-bottom:18px;padding-left:20px;">
                      <p style="margin-top:0;margin-right:0;margin-bottom:7px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#a6e3a1;font-weight:bold;letter-spacing:0.7px;text-transform:uppercase;">Submitter</p>
                      <p style="margin-top:0;margin-right:0;margin-bottom:4px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#bac2de;">Name or handle: ${escapeHtml(details.submitterName || 'Not provided')}</p>
                      <p style="margin-top:0;margin-right:0;margin-bottom:4px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#bac2de;">Email: ${escapeHtml(details.email)}</p>
                      <p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#bac2de;">Credit preference: ${escapeHtml(details.creditLabel)}</p>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#181825" style="width:100%;background-color:#181825;border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;">
                  <tr>
                    <td bgcolor="#181825" style="background-color:#181825;padding-top:18px;padding-right:20px;padding-bottom:18px;padding-left:20px;">
                      <p style="margin-top:0;margin-right:0;margin-bottom:7px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#f9e2af;font-weight:bold;letter-spacing:0.7px;text-transform:uppercase;">Relationship or disclosure</p>
                      <p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px;color:#bac2de;">${htmlWithLineBreaks(disclosure)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="3" align="center" bgcolor="#181825" style="background-color:#181825;padding-top:20px;padding-right:24px;padding-bottom:22px;padding-left:24px;border-top-width:1px;border-top-style:solid;border-top-color:#313244;">
                <p style="margin-top:0;margin-right:0;margin-bottom:6px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#cdd6f4;font-weight:bold;">The Defender’s Dispatch editorial queue</p>
                <p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:#6c7086;">Reply to this message to contact the submitter.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const buildSubmissionNotificationText = details =>
  [
    `New Community Signal — ${details.categoryLabel}`,
    '',
    details.headline,
    '',
    `Article: ${details.articleUrl}`,
    `Source: ${details.source || 'Not provided'}`,
    '',
    'WHY IT MATTERS',
    details.whyItMatters,
    '',
    'SUBMITTER',
    `Name or handle: ${details.submitterName || 'Not provided'}`,
    `Email: ${details.email}`,
    `Credit preference: ${details.creditLabel}`,
    '',
    'RELATIONSHIP OR DISCLOSURE',
    `Relationship: ${details.relationshipLabel}`,
    details.disclosure || 'No additional disclosure provided.'
  ].join('\n');

const sendSubmissionAcknowledgement = (env, details, submissionId) =>
  resendRequest(env, '/emails', {
    method: 'POST',
    headers: {
      'idempotency-key': `community-signal-receipt/${submissionId}`
    },
    body: JSON.stringify({
      to: [details.email],
      template: {
        id: env.SUBMISSION_ACK_TEMPLATE_ID,
        variables: {
          SUBMITTER_NAME: escapeHtml(details.submitterName || 'there'),
          ARTICLE_HEADLINE: escapeHtml(details.headline)
        }
      }
    })
  });

const sendSubmissionNotification = (env, details, submissionId) =>
  resendRequest(env, '/emails', {
    method: 'POST',
    headers: {
      'idempotency-key': `community-signal-editor/${submissionId}`
    },
    body: JSON.stringify({
      from:
        env.SUBMISSION_FROM ||
        'The Defender’s Dispatch <newsletter@updates.kylereddoch.me>',
      to: [env.SUBMISSION_NOTIFY_TO],
      reply_to: details.email,
      subject: `Community Signal: ${details.headline.slice(0, 120)}`,
      html: buildSubmissionNotificationHtml(details),
      text: buildSubmissionNotificationText(details)
    })
  });

const genericSubmissionAcceptedResponse = (request, env) =>
  jsonResponse(
    request,
    env,
    {
      ok: true,
      message: 'Thanks. Your submission has been received for editorial review.'
    },
    202
  );

const handleSubmission = async (request, env) => {
  const allowedOrigin = getAllowedOrigin(request, env);
  if (!allowedOrigin) {
    return jsonResponse(request, env, { message: 'This request origin is not allowed.' }, 403);
  }

  if (!hasRequiredSubmissionConfiguration(env)) {
    return jsonResponse(
      request,
      env,
      { message: 'Reader submissions are temporarily unavailable.' },
      503
    );
  }

  const body = await parseJsonBody(request);
  if (body.website) return genericSubmissionAcceptedResponse(request, env);

  const details = {
    headline: normalizeInlineText(body.headline, 180),
    articleUrl: normalizeArticleUrl(body.articleUrl),
    source: normalizeInlineText(body.source, 120),
    whyItMatters: normalizeLongText(body.whyItMatters, 1200),
    category: String(body.category || ''),
    submitterName: normalizeInlineText(body.submitterName, 100),
    email: normalizeEmail(body.email),
    creditPreference: String(body.creditPreference || ''),
    relationship: String(body.relationship || ''),
    disclosure: normalizeLongText(body.disclosure, 600)
  };

  details.categoryLabel = SUBMISSION_CATEGORIES.get(details.category) || '';
  details.creditLabel = CREDIT_PREFERENCES.get(details.creditPreference) || '';
  details.relationshipLabel = RELATIONSHIPS.get(details.relationship) || '';

  if (!details.headline) {
    return jsonResponse(request, env, { message: 'Enter the article headline.' }, 400);
  }
  if (!details.articleUrl) {
    return jsonResponse(request, env, { message: 'Enter a valid article URL.' }, 400);
  }
  if (!details.whyItMatters) {
    return jsonResponse(
      request,
      env,
      { message: 'Tell me why this deserves attention.' },
      400
    );
  }
  if (!details.categoryLabel) {
    return jsonResponse(request, env, { message: 'Choose a submission category.' }, 400);
  }
  if (!isValidEmail(details.email)) {
    return jsonResponse(request, env, { message: 'Enter a valid email address.' }, 400);
  }
  if (!details.creditLabel) {
    return jsonResponse(request, env, { message: 'Choose a credit preference.' }, 400);
  }
  if (
    details.creditPreference !== 'anonymous' &&
    !details.submitterName
  ) {
    return jsonResponse(
      request,
      env,
      { message: 'Enter the name or handle you want credited.' },
      400
    );
  }
  if (!details.relationshipLabel) {
    return jsonResponse(
      request,
      env,
      { message: 'Choose your relationship to the submitted material.' },
      400
    );
  }
  if (details.relationship !== 'none' && !details.disclosure) {
    return jsonResponse(
      request,
      env,
      { message: 'Briefly describe your relationship to the submitted material.' },
      400
    );
  }
  if (!body.consent) {
    return jsonResponse(
      request,
      env,
      { message: 'Please acknowledge the submission and privacy terms.' },
      400
    );
  }
  if (!(await enforceRateLimit(request, env, 'submission'))) {
    return genericSubmissionAcceptedResponse(request, env);
  }
  if (
    !(await verifyTurnstile(
      request,
      env,
      String(body.turnstileToken || ''),
      'reader-submission'
    ))
  ) {
    return jsonResponse(
      request,
      env,
      { message: 'The security check could not be verified. Please try again.' },
      400
    );
  }

  const dedupeHash = await sha256(`${details.email}\n${details.articleUrl}`);
  const dedupeKey = `submission:${dedupeHash}`;
  const existing = await kvGetJson(env, dedupeKey);
  const submissionId =
    existing?.submissionId ||
    crypto.randomUUID();

  if (!existing?.submissionId) {
    await kvPutJson(
      env,
      dedupeKey,
      { submissionId, createdAt: Date.now() },
      SUBMISSION_DEDUPE_TTL_SECONDS
    );
  }

  await Promise.all([
    sendSubmissionAcknowledgement(env, details, submissionId),
    sendSubmissionNotification(env, details, submissionId)
  ]);

  return genericSubmissionAcceptedResponse(request, env);
};

const handleSubscribe = async (request, env) => {
  const allowedOrigin = getAllowedOrigin(request, env);
  if (!allowedOrigin) {
    return jsonResponse(request, env, { message: 'This request origin is not allowed.' }, 403);
  }

  if (!hasRequiredConfiguration(env)) {
    return jsonResponse(
      request,
      env,
      { message: 'Newsletter signup is temporarily unavailable.' },
      503
    );
  }

  const body = await parseJsonBody(request);
  const email = normalizeEmail(body.email);
  const firstName = normalizeName(body.firstName).slice(0, 80);
  const signupPath = sanitizePath(body.signupPath);

  if (body.website) return genericAcceptedResponse(request, env);
  if (!body.consent) {
    return jsonResponse(request, env, { message: 'Please agree to receive the newsletter.' }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse(request, env, { message: 'Enter a valid email address.' }, 400);
  }
  if (!(await enforceRateLimit(request, env, 'signup'))) {
    return genericAcceptedResponse(request, env);
  }
  if (
    !(await verifyTurnstile(
      request,
      env,
      String(body.turnstileToken || ''),
      'newsletter-signup'
    ))
  ) {
    return jsonResponse(
      request,
      env,
      { message: 'The security check could not be verified. Please try again.' },
      400
    );
  }

  const emailHash = await sha256(email);
  const cooldownKey = `pending-email:${emailHash}`;
  const existingPending = await kvGetJson(env, cooldownKey);

  if (
    existingPending?.issuedAt &&
    Date.now() - existingPending.issuedAt < RESEND_COOLDOWN_SECONDS * 1000
  ) {
    return genericAcceptedResponse(request, env);
  }

  const foundingReader = isFoundingReader(env);
  const { contact, alreadyActive } = await ensurePendingContact(env, {
    email,
    firstName,
    signupPath,
    foundingReader
  });

  if (alreadyActive) return genericAcceptedResponse(request, env);

  const token = randomToken();
  const tokenHash = await sha256(token);
  const confirmationKey = `confirm:${tokenHash}`;
  const issuedAt = Date.now();
  const pending = {
    state: 'pending',
    email,
    contactId: contact?.id || '',
    signupSource: 'website',
    signupPath,
    primaryInterest: 'cybersecurity-it-msp',
    foundingReader,
    issuedAt
  };

  if (existingPending?.confirmationKey) {
    await env.NEWSLETTER_DATA.delete(existingPending.confirmationKey);
  }

  await Promise.all([
    kvPutJson(env, confirmationKey, pending, CONFIRMATION_TTL_SECONDS),
    kvPutJson(
      env,
      cooldownKey,
      { issuedAt, confirmationKey },
      CONFIRMATION_TTL_SECONDS
    )
  ]);

  const confirmationUrl = new URL('/newsletter/confirm', request.url);
  confirmationUrl.searchParams.set('token', token);

  try {
    await sendConfirmationEmail(
      env,
      email,
      confirmationUrl.toString(),
      `newsletter-confirmation/${tokenHash}`
    );
  } catch (error) {
    await Promise.all([
      env.NEWSLETTER_DATA.delete(confirmationKey),
      env.NEWSLETTER_DATA.delete(cooldownKey)
    ]);
    throw error;
  }

  return genericAcceptedResponse(request, env);
};

const buildConfirmationRedirect = (env, status) => {
  const base = String(env.CONFIRMATION_REDIRECT_BASE || DEFAULT_SITE_ORIGIN);
  const url = new URL('/newsletter/confirmed/', base);
  if (status !== 'success') url.searchParams.set('status', status);
  return url.toString();
};

const handleConfirmLanding = async (request, env) => {
  const token = new URL(request.url).searchParams.get('token') || '';
  if (!/^[A-Za-z0-9_-]{40,64}$/.test(token)) {
    return redirectResponse(buildConfirmationRedirect(env, 'invalid'));
  }

  const base = String(env.CONFIRMATION_REDIRECT_BASE || DEFAULT_SITE_ORIGIN);
  const destination = new URL('/newsletter/confirm/', base);
  destination.hash = token;
  return redirectResponse(destination.toString());
};

const handleConfirm = async (request, env) => {
  const allowedOrigin = getAllowedOrigin(request, env);
  if (!allowedOrigin) {
    return jsonResponse(request, env, { message: 'This request origin is not allowed.' }, 403);
  }

  if (!hasRequiredConfiguration(env)) {
    return jsonResponse(
      request,
      env,
      {
        code: 'error',
        message: 'Newsletter confirmation is temporarily unavailable.'
      },
      503
    );
  }

  const body = await parseJsonBody(request);
  const token = String(body.token || '');
  if (!/^[A-Za-z0-9_-]{40,64}$/.test(token)) {
    return jsonResponse(
      request,
      env,
      { code: 'invalid', message: 'This confirmation link is invalid or expired.' },
      400
    );
  }

  const tokenHash = await sha256(token);
  const confirmationKey = `confirm:${tokenHash}`;
  const pending = await kvGetJson(env, confirmationKey);

  if (pending?.state === 'confirmed') {
    return jsonResponse(request, env, {
      ok: true,
      redirect: '/newsletter/confirmed/'
    });
  }

  if (!pending?.email || Date.now() - pending.issuedAt > CONFIRMATION_TTL_SECONDS * 1000) {
    if (pending) await env.NEWSLETTER_DATA.delete(confirmationKey);
    return jsonResponse(
      request,
      env,
      { code: 'invalid', message: 'This confirmation link is invalid or expired.' },
      400
    );
  }

  const emailHash = await sha256(pending.email);
  const confirmedEmailKey = `confirmed-email:${emailHash}`;
  const existingConfirmation = await kvGetJson(env, confirmedEmailKey);

  if (existingConfirmation?.confirmedAt) {
    await Promise.all([
      kvPutJson(
        env,
        confirmationKey,
        { state: 'confirmed', confirmedAt: existingConfirmation.confirmedAt },
        CONFIRMATION_TTL_SECONDS
      ),
      env.NEWSLETTER_DATA.delete(`pending-email:${emailHash}`)
    ]);

    return jsonResponse(request, env, {
      ok: true,
      redirect: '/newsletter/confirmed/'
    });
  }

  let confirmationStage = 'contact_lookup';

  try {
    const contactIdentifier = pending.contactId || pending.email;
    const contact = await getContact(env, contactIdentifier);

    if (!contact) {
      throw new ServiceError('The pending newsletter contact no longer exists.', 409);
    }

    confirmationStage = 'topic_lookup';
    const topics = await getContactTopics(env, contactIdentifier);
    const newsletterTopic = topics.find(topic => topic.id === env.NEWSLETTER_TOPIC_ID);
    const alreadyActive =
      contact.unsubscribed === false &&
      newsletterTopic?.subscription === 'opt_in';

    if (!alreadyActive) {
      confirmationStage = 'contact_activation';
      await resendRequest(env, `/contacts/${encodeURIComponent(contactIdentifier)}`, {
        method: 'PATCH',
        body: JSON.stringify({ unsubscribed: false })
      });

      confirmationStage = 'topic_activation';
      await resendRequest(
        env,
        `/contacts/${encodeURIComponent(contactIdentifier)}/topics`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            topics: [
              {
                id: env.NEWSLETTER_TOPIC_ID,
                subscription: 'opt_in'
              }
            ]
          })
        }
      );
    }

    const confirmedAt = new Date().toISOString();
    confirmationStage = 'automation_event';
    await resendRequest(env, '/events/send', {
      method: 'POST',
      body: JSON.stringify({
        event: 'newsletter.subscribed',
        email: pending.email,
        payload: {
          signup_source: pending.signupSource,
          signup_path: pending.signupPath,
          confirmed_at: confirmedAt,
          primary_interest: pending.primaryInterest,
          founding_reader: pending.foundingReader
        }
      })
    });

    await Promise.all([
      kvPutJson(
        env,
        confirmationKey,
        { state: 'confirmed', confirmedAt },
        CONFIRMATION_TTL_SECONDS
      ),
      kvPutJson(
        env,
        confirmedEmailKey,
        { confirmedAt },
        CONFIRMATION_TTL_SECONDS
      ),
      env.NEWSLETTER_DATA.delete(`pending-email:${emailHash}`)
    ]);

    return jsonResponse(request, env, {
      ok: true,
      redirect: '/newsletter/confirmed/'
    });
  } catch (error) {
    console.error('Newsletter confirmation failed.', {
      stage: confirmationStage,
      name: error.name,
      status: error.upstreamStatus || error.status || 500,
      upstreamCode: error.upstreamPayload?.name || error.upstreamPayload?.code || '',
      upstreamMessage: error.upstreamPayload?.message || ''
    });
    return jsonResponse(
      request,
      env,
      {
        code: 'error',
        message: 'The confirmation could not be completed. Please try again.'
      },
      503
    );
  }
};

const handleOptions = (request, env) => {
  if (!getAllowedOrigin(request, env)) {
    return jsonResponse(request, env, { message: 'This request origin is not allowed.' }, 403);
  }
  return new Response(null, {
    status: 204,
    headers: buildHeaders(request, env)
  });
};

export const handleRequest = async (request, env) => {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') return handleOptions(request, env);

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse(request, env, {
      ok: true,
      service: 'cyberseckyle-newsletter-api',
      configured: hasRequiredConfiguration(env),
      submissionsConfigured: hasRequiredSubmissionConfiguration(env)
    });
  }

  try {
    if (request.method === 'POST' && url.pathname === '/newsletter/subscribe') {
      return await handleSubscribe(request, env);
    }
    if (request.method === 'GET' && url.pathname === '/newsletter/confirm') {
      return await handleConfirmLanding(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/newsletter/confirm') {
      return await handleConfirm(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/news/submit') {
      return await handleSubmission(request, env);
    }
  } catch (error) {
    console.error('Newsletter API request failed.', {
      name: error.name,
      status: error.upstreamStatus || error.status || 500
    });
    return jsonResponse(
      request,
      env,
      { message: 'The newsletter service could not complete the request. Please try again.' },
      error.status && error.status < 500 ? error.status : 503
    );
  }

  return jsonResponse(request, env, { message: 'Not found.' }, 404);
};

export default {
  fetch: handleRequest
};
