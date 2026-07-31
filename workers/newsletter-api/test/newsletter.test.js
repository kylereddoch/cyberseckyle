import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRequest } from '../src/index.js';

class MemoryKv {
  constructor() {
    this.values = new Map();
  }

  async get(key, options = {}) {
    if (!this.values.has(key)) return null;
    const value = this.values.get(key);
    return options.type === 'json' ? JSON.parse(value) : value;
  }

  async put(key, value) {
    this.values.set(key, value);
  }

  async delete(key) {
    this.values.delete(key);
  }
}

const makeEnv = kv => ({
  SITE_ORIGIN: 'https://www.kylereddoch.me',
  CONFIRMATION_REDIRECT_BASE: 'https://www.kylereddoch.me',
  TURNSTILE_EXPECTED_HOSTNAME: 'www.kylereddoch.me',
  TURNSTILE_VERIFY_URL: 'https://turnstile.test/siteverify',
  TURNSTILE_SECRET_KEY: 'turnstile-secret',
  RESEND_API_BASE_URL: 'https://api.resend.test',
  RESEND_API_KEY: 'resend-secret',
  NEWSLETTER_TOPIC_ID: 'topic-123',
  CONFIRM_TEMPLATE_ID: 'template-123',
  SUBMISSION_ACK_TEMPLATE_ID: 'submission-template-123',
  SUBMISSION_NOTIFY_TO: 'newsletter@example.com',
  NEWSLETTER_NOTIFY_TO: 'newsletter-owner@example.com',
  SUBMISSION_FROM: 'The Defender’s Dispatch <newsletter@updates.example.com>',
  NEWSLETTER_DATA: kv
});

const makeSignupRequest = overrides =>
  new Request('https://newsletter-api.example.workers.dev/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.kylereddoch.me',
      'CF-Connecting-IP': '192.0.2.10'
    },
    body: JSON.stringify({
      email: 'reader@example.com',
      firstName: 'Alex',
      consent: true,
      website: '',
      signupPath: '/newsletter/',
      turnstileToken: 'valid-token',
      ...overrides
    })
  });

const makeSubmissionRequest = overrides =>
  new Request('https://newsletter-api.example.workers.dev/news/submit', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.kylereddoch.me',
      'CF-Connecting-IP': '192.0.2.25'
    },
    body: JSON.stringify({
      headline: 'A useful security story',
      articleUrl: 'https://security.example/story',
      source: 'Security Example',
      whyItMatters: 'It includes practical detection and remediation details.',
      category: 'cybersecurity',
      submitterName: 'Alex Defender',
      email: 'alex@example.com',
      creditPreference: 'name',
      relationship: 'none',
      disclosure: '',
      consent: true,
      website: '',
      turnstileToken: 'valid-submission-token',
      ...overrides
    })
  });

const makeConfirmRequest = token =>
  new Request('https://newsletter-api.example.workers.dev/newsletter/confirm', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.kylereddoch.me'
    },
    body: JSON.stringify({ token })
  });

test('signup creates a pending contact and sends the published confirmation template', async t => {
  const kv = new MemoryKv();
  const requests = [];
  let confirmationUrl = '';
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    requests.push({ url: String(url), options });

    if (String(url).startsWith('https://turnstile.test/')) {
      return Response.json({
        success: true,
        action: 'newsletter-signup',
        hostname: 'www.kylereddoch.me'
      });
    }
    if (String(url).endsWith('/contacts/reader%40example.com')) {
      return Response.json({ message: 'Not found' }, { status: 404 });
    }
    if (String(url).endsWith('/contacts')) {
      return Response.json({ id: 'contact-123', email: 'reader@example.com' });
    }
    if (String(url).endsWith('/emails')) {
      const body = JSON.parse(options.body);
      confirmationUrl = body.template.variables.CONFIRMATION_URL;
      return Response.json({ id: 'email-123' });
    }

    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await handleRequest(makeSignupRequest(), makeEnv(kv));
  const result = await response.json();

  assert.equal(response.status, 202);
  assert.equal(result.ok, true);
  assert.match(confirmationUrl, /^https:\/\/newsletter-api\.example\.workers\.dev\/newsletter\/confirm\?token=/);

  const createContact = requests.find(item => item.url.endsWith('/contacts'));
  const contactBody = JSON.parse(createContact.options.body);
  assert.equal(contactBody.unsubscribed, true);
  assert.equal(contactBody.first_name, 'Alex');
  assert.equal(contactBody.properties.signup_source, 'website');

  const sendEmail = requests.find(item => item.url.endsWith('/emails'));
  const emailBody = JSON.parse(sendEmail.options.body);
  assert.equal(emailBody.template.id, 'template-123');
  assert.match(sendEmail.options.headers.get('idempotency-key'), /^newsletter-confirmation\//);
});

test('an intentional confirmation opts into the topic and triggers the welcome automation', async t => {
  const kv = new MemoryKv();
  let confirmationUrl = '';
  let eventBody = null;
  let notificationRequest = null;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    const requestUrl = String(url);

    if (requestUrl.startsWith('https://turnstile.test/')) {
      return Response.json({
        success: true,
        action: 'newsletter-signup',
        hostname: 'www.kylereddoch.me'
      });
    }
    if (requestUrl.endsWith('/contacts/reader%40example.com') && options.method !== 'PATCH') {
      return Response.json({ message: 'Not found' }, { status: 404 });
    }
    if (requestUrl.endsWith('/contacts')) {
      return Response.json({ id: 'contact-123', email: 'reader@example.com' });
    }
    if (requestUrl.endsWith('/emails')) {
      const emailBody = JSON.parse(options.body);
      if (emailBody.template) {
        confirmationUrl = emailBody.template.variables.CONFIRMATION_URL;
      } else {
        notificationRequest = {
          body: emailBody,
          idempotencyKey: options.headers.get('idempotency-key')
        };
      }
      return Response.json({ id: 'email-123' });
    }
    if (requestUrl.endsWith('/contacts/contact-123') && options.method !== 'PATCH') {
      return Response.json({
        id: 'contact-123',
        email: 'reader@example.com',
        unsubscribed: true
      });
    }
    if (requestUrl.endsWith('/contacts/contact-123') && options.method === 'PATCH') {
      assert.equal(JSON.parse(options.body).unsubscribed, false);
      return Response.json({ id: 'contact-123' });
    }
    if (requestUrl.endsWith('/contacts/contact-123/topics') && options.method !== 'PATCH') {
      return Response.json({
        data: [{ id: 'topic-123', subscription: 'opt_out' }]
      });
    }
    if (requestUrl.endsWith('/contacts/contact-123/topics') && options.method === 'PATCH') {
      const topicBody = JSON.parse(options.body);
      assert.deepEqual(topicBody.topics, [{ id: 'topic-123', subscription: 'opt_in' }]);
      return Response.json({ id: 'contact-123' });
    }
    if (requestUrl.endsWith('/events/send')) {
      eventBody = JSON.parse(options.body);
      return Response.json({ id: 'event-123' });
    }

    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const env = makeEnv(kv);
  const signupResponse = await handleRequest(makeSignupRequest(), env);
  assert.equal(signupResponse.status, 202);

  const handoffResponse = await handleRequest(new Request(confirmationUrl), env);
  assert.equal(handoffResponse.status, 302);
  const handoffUrl = new URL(handoffResponse.headers.get('location'));
  assert.equal(handoffUrl.origin, 'https://www.kylereddoch.me');
  assert.equal(handoffUrl.pathname, '/newsletter/confirm/');
  assert.ok(handoffUrl.hash.length > 40);

  const confirmResponse = await handleRequest(makeConfirmRequest(handoffUrl.hash.slice(1)), env);
  const confirmResult = await confirmResponse.json();

  assert.equal(confirmResponse.status, 200);
  assert.equal(confirmResult.redirect, '/newsletter/confirmed/');
  assert.equal(eventBody.event, 'newsletter.subscribed');
  assert.equal(eventBody.email, 'reader@example.com');
  assert.equal(eventBody.payload.founding_reader, 'false');
  assert.equal(typeof eventBody.payload.confirmed_at, 'string');
  assert.equal(notificationRequest.body.to[0], 'newsletter-owner@example.com');
  assert.equal(notificationRequest.body.subject, 'New confirmed newsletter subscriber');
  assert.match(notificationRequest.body.text, /Email: reader@example\.com/);
  assert.match(notificationRequest.body.text, /First name: Alex/);
  assert.match(notificationRequest.body.text, /Signup page: \/newsletter\//);
  assert.match(
    notificationRequest.idempotencyKey,
    /^newsletter-subscriber-notification\//
  );
  const confirmationReceipt = [...kv.values.entries()].find(([key]) =>
    key.startsWith('confirm:')
  );
  assert.equal(JSON.parse(confirmationReceipt[1]).state, 'confirmed');
});

test('a completed confirmation can be retried without triggering a second automation run', async t => {
  const kv = new MemoryKv();
  let confirmationUrl = '';
  let eventCount = 0;
  let notificationCount = 0;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    const requestUrl = String(url);

    if (requestUrl.startsWith('https://turnstile.test/')) {
      return Response.json({
        success: true,
        action: 'newsletter-signup',
        hostname: 'www.kylereddoch.me'
      });
    }
    if (requestUrl.endsWith('/contacts/reader%40example.com')) {
      return Response.json({ message: 'Not found' }, { status: 404 });
    }
    if (requestUrl.endsWith('/contacts')) {
      return Response.json({ id: 'contact-123', email: 'reader@example.com' });
    }
    if (requestUrl.endsWith('/emails')) {
      const emailBody = JSON.parse(options.body);
      if (emailBody.template) {
        confirmationUrl = emailBody.template.variables.CONFIRMATION_URL;
      } else {
        notificationCount += 1;
      }
      return Response.json({ id: 'email-123' });
    }
    if (requestUrl.endsWith('/contacts/contact-123') && options.method !== 'PATCH') {
      return Response.json({ id: 'contact-123', unsubscribed: true });
    }
    if (requestUrl.endsWith('/contacts/contact-123/topics') && options.method !== 'PATCH') {
      return Response.json({ data: [{ id: 'topic-123', subscription: 'opt_out' }] });
    }
    if (requestUrl.endsWith('/contacts/contact-123') && options.method === 'PATCH') {
      return Response.json({ id: 'contact-123' });
    }
    if (requestUrl.endsWith('/contacts/contact-123/topics') && options.method === 'PATCH') {
      return Response.json({ id: 'contact-123' });
    }
    if (requestUrl.endsWith('/events/send')) {
      eventCount += 1;
      return Response.json({ id: 'event-123' });
    }

    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const env = makeEnv(kv);
  await handleRequest(makeSignupRequest(), env);
  const token = new URL(confirmationUrl).searchParams.get('token');

  const firstResponse = await handleRequest(makeConfirmRequest(token), env);
  const retryResponse = await handleRequest(makeConfirmRequest(token), env);

  assert.equal(firstResponse.status, 200);
  assert.equal(retryResponse.status, 200);
  assert.equal(eventCount, 1);
  assert.equal(notificationCount, 1);
});

test('a temporary confirmation failure keeps the token available for retry', async t => {
  const kv = new MemoryKv();
  let confirmationUrl = '';
  let eventCount = 0;
  let contactActive = false;
  let topicActive = false;
  let contactActivationCount = 0;
  let topicActivationCount = 0;
  let notificationCount = 0;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    const requestUrl = String(url);

    if (requestUrl.startsWith('https://turnstile.test/')) {
      return Response.json({
        success: true,
        action: 'newsletter-signup',
        hostname: 'www.kylereddoch.me'
      });
    }
    if (requestUrl.endsWith('/contacts/reader%40example.com')) {
      return Response.json({ message: 'Not found' }, { status: 404 });
    }
    if (requestUrl.endsWith('/contacts')) {
      return Response.json({ id: 'contact-123', email: 'reader@example.com' });
    }
    if (requestUrl.endsWith('/emails')) {
      const emailBody = JSON.parse(options.body);
      if (emailBody.template) {
        confirmationUrl = emailBody.template.variables.CONFIRMATION_URL;
        return Response.json({ id: 'email-123' });
      }

      notificationCount += 1;
      return Response.json(
        { name: 'temporary_error', message: 'Notification unavailable.' },
        { status: 500 }
      );
    }
    if (requestUrl.endsWith('/contacts/contact-123') && options.method !== 'PATCH') {
      return Response.json({ id: 'contact-123', unsubscribed: !contactActive });
    }
    if (requestUrl.endsWith('/contacts/contact-123/topics') && options.method !== 'PATCH') {
      return Response.json({
        data: [{ id: 'topic-123', subscription: topicActive ? 'opt_in' : 'opt_out' }]
      });
    }
    if (requestUrl.endsWith('/contacts/contact-123') && options.method === 'PATCH') {
      contactActive = true;
      contactActivationCount += 1;
      return Response.json({ id: 'contact-123' });
    }
    if (requestUrl.endsWith('/contacts/contact-123/topics') && options.method === 'PATCH') {
      topicActive = true;
      topicActivationCount += 1;
      return Response.json({ id: 'contact-123' });
    }
    if (requestUrl.endsWith('/events/send')) {
      eventCount += 1;
      return eventCount === 1
        ? Response.json({ name: 'temporary_error', message: 'Try again.' }, { status: 500 })
        : Response.json({ id: 'event-123' });
    }

    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const env = makeEnv(kv);
  await handleRequest(makeSignupRequest(), env);
  const token = new URL(confirmationUrl).searchParams.get('token');

  const failedResponse = await handleRequest(makeConfirmRequest(token), env);
  const retryResponse = await handleRequest(makeConfirmRequest(token), env);

  assert.equal(failedResponse.status, 503);
  assert.equal(retryResponse.status, 200);
  assert.equal(eventCount, 2);
  assert.equal(contactActivationCount, 1);
  assert.equal(topicActivationCount, 1);
  assert.equal(notificationCount, 1);
});

test('issuing a fresh confirmation link invalidates the previous link', async t => {
  const kv = new MemoryKv();
  const confirmationUrls = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    const requestUrl = String(url);

    if (requestUrl.startsWith('https://turnstile.test/')) {
      return Response.json({
        success: true,
        action: 'newsletter-signup',
        hostname: 'www.kylereddoch.me'
      });
    }
    if (requestUrl.endsWith('/contacts/reader%40example.com') && options.method !== 'PATCH') {
      const alreadyCreated = confirmationUrls.length > 0;
      return alreadyCreated
        ? Response.json({ id: 'contact-123', email: 'reader@example.com', unsubscribed: true })
        : Response.json({ message: 'Not found' }, { status: 404 });
    }
    if (requestUrl.endsWith('/contacts/reader%40example.com') && options.method === 'PATCH') {
      return Response.json({ id: 'contact-123' });
    }
    if (requestUrl.endsWith('/contacts/reader%40example.com/topics')) {
      return Response.json({ data: [{ id: 'topic-123', subscription: 'opt_out' }] });
    }
    if (requestUrl.endsWith('/contacts')) {
      return Response.json({ id: 'contact-123', email: 'reader@example.com' });
    }
    if (requestUrl.endsWith('/emails')) {
      confirmationUrls.push(JSON.parse(options.body).template.variables.CONFIRMATION_URL);
      return Response.json({ id: `email-${confirmationUrls.length}` });
    }

    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const env = makeEnv(kv);
  await handleRequest(makeSignupRequest(), env);

  const cooldownEntry = [...kv.values.entries()].find(([key]) => key.startsWith('pending-email:'));
  const cooldown = JSON.parse(cooldownEntry[1]);
  cooldown.issuedAt -= 16 * 60 * 1000;
  kv.values.set(cooldownEntry[0], JSON.stringify(cooldown));

  await handleRequest(makeSignupRequest(), env);

  const oldToken = new URL(confirmationUrls[0]).searchParams.get('token');
  const oldResponse = await handleRequest(makeConfirmRequest(oldToken), env);
  const oldResult = await oldResponse.json();

  assert.equal(confirmationUrls.length, 2);
  assert.equal(oldResponse.status, 400);
  assert.equal(oldResult.code, 'invalid');
});

test('signup rejects an untrusted origin before contacting upstream services', async () => {
  const kv = new MemoryKv();
  const request = new Request(
    'https://newsletter-api.example.workers.dev/newsletter/subscribe',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://attacker.example'
      },
      body: JSON.stringify({
        email: 'reader@example.com',
        consent: true,
        turnstileToken: 'valid-token'
      })
    }
  );

  const response = await handleRequest(request, makeEnv(kv));
  assert.equal(response.status, 403);
});

test('fetching the email link does not activate the subscription', async t => {
  const kv = new MemoryKv();
  let confirmationUrl = '';
  let eventSent = false;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    const requestUrl = String(url);

    if (requestUrl.startsWith('https://turnstile.test/')) {
      return Response.json({
        success: true,
        action: 'newsletter-signup',
        hostname: 'www.kylereddoch.me'
      });
    }
    if (requestUrl.endsWith('/contacts/reader%40example.com')) {
      return Response.json({ message: 'Not found' }, { status: 404 });
    }
    if (requestUrl.endsWith('/contacts')) {
      return Response.json({ id: 'contact-123', email: 'reader@example.com' });
    }
    if (requestUrl.endsWith('/emails')) {
      confirmationUrl = JSON.parse(options.body).template.variables.CONFIRMATION_URL;
      return Response.json({ id: 'email-123' });
    }
    if (requestUrl.endsWith('/events/send')) eventSent = true;

    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const env = makeEnv(kv);
  await handleRequest(makeSignupRequest(), env);
  const response = await handleRequest(new Request(confirmationUrl), env);

  assert.equal(response.status, 302);
  assert.match(
    response.headers.get('location'),
    /^https:\/\/www\.kylereddoch\.me\/newsletter\/confirm\/#/
  );
  assert.equal(eventSent, false);
});

test('reader submission sends a receipt and a structured editorial notification', async t => {
  const kv = new MemoryKv();
  const emailRequests = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options = {}) => {
    const requestUrl = String(url);

    if (requestUrl.startsWith('https://turnstile.test/')) {
      return Response.json({
        success: true,
        action: 'reader-submission',
        hostname: 'www.kylereddoch.me'
      });
    }
    if (requestUrl.endsWith('/emails')) {
      emailRequests.push({
        body: JSON.parse(options.body),
        idempotencyKey: options.headers.get('idempotency-key')
      });
      return Response.json({ id: `email-${emailRequests.length}` });
    }

    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await handleRequest(makeSubmissionRequest(), makeEnv(kv));
  const result = await response.json();

  assert.equal(response.status, 202);
  assert.equal(result.ok, true);
  assert.equal(emailRequests.length, 2);

  const receipt = emailRequests.find(item => item.body.template);
  const notification = emailRequests.find(item => item.body.html);

  assert.equal(receipt.body.to[0], 'alex@example.com');
  assert.equal(receipt.body.template.id, 'submission-template-123');
  assert.equal(
    receipt.body.template.variables.ARTICLE_HEADLINE,
    'A useful security story'
  );
  assert.match(receipt.idempotencyKey, /^community-signal-receipt\//);

  assert.equal(notification.body.to[0], 'newsletter@example.com');
  assert.equal(notification.body.reply_to, 'alex@example.com');
  assert.match(notification.body.subject, /^Community Signal:/);
  assert.match(notification.body.html, /A useful security story/);
  assert.match(notification.body.text, /practical detection and remediation/);
  assert.match(notification.idempotencyKey, /^community-signal-editor\//);
  assert.equal(
    [...kv.values.keys()].some(key => key.startsWith('submission:')),
    true
  );
});

test('reader submission honeypot returns success without sending email', async t => {
  const kv = new MemoryKv();
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    fetchCalled = true;
    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await handleRequest(
    makeSubmissionRequest({ website: 'https://spam.example' }),
    makeEnv(kv)
  );

  assert.equal(response.status, 202);
  assert.equal(fetchCalled, false);
});

test('reader submission rejects non-web URLs before contacting upstream services', async t => {
  const kv = new MemoryKv();
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    fetchCalled = true;
    return Response.json({ message: 'Unexpected request' }, { status: 500 });
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await handleRequest(
    makeSubmissionRequest({ articleUrl: 'file:///etc/passwd' }),
    makeEnv(kv)
  );
  const result = await response.json();

  assert.equal(response.status, 400);
  assert.equal(result.message, 'Enter a valid article URL.');
  assert.equal(fetchCalled, false);
});
