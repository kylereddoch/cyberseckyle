import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const TRAKT_API_URL = 'https://api.trakt.tv';

const clientId = process.env.TRAKT_CLIENT_ID?.trim();
const clientSecret = process.env.TRAKT_CLIENT_SECRET?.trim();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const requestJson = async (path, body) => {
  const response = await fetch(`${TRAKT_API_URL}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.error_description || payload.error || response.statusText;
    const error = new Error(`${response.status} ${response.statusText}: ${message}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

if (!clientId || !clientSecret) {
  console.error('Missing TRAKT_CLIENT_ID or TRAKT_CLIENT_SECRET in .env.');
  console.error('Add both values from your Trakt API app, then run this script again.');
  process.exit(1);
}

const device = await requestJson('/oauth/device/code', {
  client_id: clientId
});

console.log('\nAuthorize CybersecKyle Watching with Trakt');
console.log('--------------------------------------------------');
console.log(`1. Open: ${device.verification_url}`);
console.log(`2. Enter code: ${device.user_code}`);
console.log('3. Approve the app, then leave this terminal open.\n');

const deadline = Date.now() + (Number(device.expires_in) || 600) * 1000;
const intervalMs = (Number(device.interval) || 5) * 1000;

let token;

while (Date.now() < deadline) {
  await sleep(intervalMs);

  try {
    token = await requestJson('/oauth/device/token', {
      code: device.device_code,
      client_id: clientId,
      client_secret: clientSecret
    });
    break;
  } catch (error) {
    const pending = error.payload?.error === 'authorization_pending';
    const slowDown = error.payload?.error === 'slow_down';

    if (pending || slowDown) {
      process.stdout.write('.');
      continue;
    }

    throw error;
  }
}

if (!token?.access_token) {
  console.error('\nTimed out waiting for Trakt authorization. Run the script again when you are ready.');
  process.exit(1);
}

console.log('\n\nSuccess. Add/update these values locally and in GitHub Actions secrets:');
console.log('--------------------------------------------------');
console.log(`TRAKT_ACCESS_TOKEN=${token.access_token}`);

if (token.refresh_token) {
  console.log(`TRAKT_REFRESH_TOKEN=${token.refresh_token}`);
}

if (token.expires_in) {
  const expiresAt = new Date((Number(token.created_at) + Number(token.expires_in)) * 1000);
  console.log(`\nAccess token expires around: ${expiresAt.toISOString()}`);
}
