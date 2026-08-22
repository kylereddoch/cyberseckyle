# Social sharing and syndication

The site has two separate social features:

- Reader sharing: the share row lets visitors open a prefilled composer for Mastodon, X, Facebook, Bluesky, or LinkedIn. These links do not require the site to hold a visitor's social credentials.
- Author syndication: eligible articles can be published automatically to Mastodon and X after the public article and its Open Graph image are available.

## Enable automatic X publishing

Automatic X publishing uses Buffer's GraphQL API and its immediate `shareNow` mode. It is disabled by default, and it does not use or require a paid X developer API account.

1. Connect the X account in Buffer.
2. In Buffer, open **Settings > API** and create a personal API key.
3. Add that key as the GitHub Actions repository secret `BUFFER_API_KEY`.
4. Add the repository variable `X_AUTO_POST_ENABLED` with the value `true`.

If Buffer has only one connected X account, the workflow finds it automatically. If Buffer has multiple X accounts, add `BUFFER_X_CHANNEL_ID` as a repository variable. `BUFFER_X_CHANNEL_NAME` can also select an account by its handle, without the `@`.

Do not enable `X_AUTO_POST_ENABLED` until the Buffer key is in place. The workflow waits until the article and its Open Graph image are publicly available, then tells Buffer to post immediately rather than adding the post to its queue.

## Mark an article for X

Add these fields to an article's front matter:

```yaml
x_post: true
x_url:
```

The publishing workflow only considers articles with `x_post: true`, so enabling it will not repost the existing archive. It records Buffer's post ID in `x_buffer_post_id` to prevent duplicates, then writes the X permalink to `x_url` when Buffer makes it available. The workflow commits those values to the article.

By default, the X post uses the article title, URL, and `x_tags` when present. If `x_tags` is absent, it reuses `mastodon_tags`. A post can override the generated copy:

```yaml
x_status: "New guide: {title}\n\n{url}"
```

Available placeholders are `{title}`, `{description}`, and `{url}`.

Before enabling the live API call, preview one article locally:

```sh
node scripts/post-to-x.mjs --dry-run path/to/article.md
```
