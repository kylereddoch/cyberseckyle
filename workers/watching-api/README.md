# Watching API Worker

This Cloudflare Worker keeps `/watching/` current without requiring an Eleventy build. A Cron Trigger refreshes Trakt data every 30 minutes, TMDb adds poster paths, and Workers KV retains the last successful public snapshot.

## Cloudflare setup

1. In **Workers & Pages**, create an application by importing this GitHub repository.
2. Set the root directory to `workers/watching-api` and the deploy command to `npm run deploy`.
3. Add the credentials listed below under **Settings > Variables and Secrets**.
4. Deploy the Worker. The `wrangler.jsonc` file automatically provisions the `WATCHING_DATA` KV binding and creates the 30-minute Cron Trigger.
5. Open `https://<worker-name>.<account-subdomain>.workers.dev/watching` and confirm that it returns JSON.

## Worker secrets

- `TRAKT_CLIENT_ID`
- `TRAKT_CLIENT_SECRET`
- `TRAKT_ACCESS_TOKEN`
- `TRAKT_REFRESH_TOKEN`
- `TMDB_API_KEY`
- `TMDB_READ_ACCESS_TOKEN`

Only one of the two TMDb credentials is required. The public `TRAKT_USERNAME` and `SITE_ORIGIN` values are already in `wrangler.jsonc`.

## Site connection

In the GitHub repository, create an Actions variable named `WATCHING_API_URL` containing the full Worker endpoint, including `/watching`. Run the **Deploy to GitHub Pages** workflow once. After that one-time connection, media data refreshes through Cloudflare instead of waiting for another site build.

For local testing, add the same `WATCHING_API_URL` value to the root `.env` file.
