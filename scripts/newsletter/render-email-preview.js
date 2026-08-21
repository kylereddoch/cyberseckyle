import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import MarkdownIt from 'markdown-it';
import yaml from 'js-yaml';

const projectRoot = process.cwd();
const issueRoot = path.join(projectRoot, 'src', 'newsletter', 'issues');
const outputRoot = path.join(projectRoot, 'dist', 'newsletter', 'email-preview');
const productionMode = process.argv.includes('--production');
const requestedIssue = process.argv.slice(2).find(argument => !argument.startsWith('--'));

const issueFiles = fs
  .readdirSync(issueRoot)
  .filter(file => file.endsWith('.md'))
  .sort((a, b) => b.localeCompare(a));

const issuePath = requestedIssue
  ? path.resolve(projectRoot, requestedIssue)
  : path.join(issueRoot, issueFiles[0] || '');

if (!issuePath.startsWith(`${path.resolve(issueRoot)}${path.sep}`) || !fs.existsSync(issuePath)) {
  throw new Error('Choose a Markdown issue inside src/newsletter/issues.');
}

const source = fs.readFileSync(issuePath, 'utf8');
const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

if (!frontMatter) {
  throw new Error(`Missing YAML front matter in ${path.relative(projectRoot, issuePath)}.`);
}

const data = yaml.load(frontMatter[1]);
const markdownSource = source.slice(frontMatter[0].length);
const requiredFields = [
  'issueNumber',
  'issueDateLabel',
  'title',
  'description',
  'emailSubject',
  'emailPreview'
];
const missingFields = requiredFields.filter(field => !data?.[field]);

if (missingFields.length) {
  throw new Error(`Missing newsletter fields: ${missingFields.join(', ')}.`);
}

const siteOrigin = 'https://www.kylereddoch.me';
const emailLogoUrl =
  'https://raw.githubusercontent.com/kylereddoch/cyberseckyle/main/src/assets/images/defenders-dispatch-logo-480h.png';
const markdown = new MarkdownIt({html: true, linkify: true, typographer: true});
const defaultLinkOpen =
  markdown.renderer.rules.link_open ||
  ((tokens, index, options, environment, renderer) => renderer.renderToken(tokens, index, options));

markdown.renderer.rules.link_open = (tokens, index, options, environment, renderer) => {
  const hrefIndex = tokens[index].attrIndex('href');
  if (hrefIndex >= 0) {
    const href = tokens[index].attrs[hrefIndex][1];
    if (href.startsWith('/')) tokens[index].attrs[hrefIndex][1] = `${siteOrigin}${href}`;
  }
  return defaultLinkOpen(tokens, index, options, environment, renderer);
};

const escapeHtml = value =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const renderedIssue = markdown.render(markdownSource);
const previewBanner = productionMode
  ? ''
  : '<div class="preview-banner">LOCAL EMAIL PREVIEW — NOTHING HAS BEEN SENT</div>';
const trackingPixel =
  productionMode && data.trackingPath
    ? `<img src="https://tinylytics.app/pixel/aK6PBymtmDm6DxSXaP2H.gif?path=${escapeHtml(data.trackingPath)}" alt="" width="1" height="1" border="0" aria-hidden="true" style="display:block;width:1px;height:1px;border-width:0;" />`
    : '<!-- The issue-specific Tinylytics pixel is intentionally omitted from local previews. -->';

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(data.emailSubject)}</title>
    <style>
      body { margin: 0; background: #11111b; color: #cdd6f4; font-family: Arial, Helvetica, sans-serif; }
      a { color: #89b4fa; font-weight: 700; }
      .preview-banner { padding: 10px 16px; background: #f9e2af; color: #11111b; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-align: center; }
      .shell { width: calc(100% - 24px); max-width: 640px; margin: 24px auto; overflow: hidden; border: 1px solid #313244; border-radius: 14px; background: #1e1e2e; }
      .accent { height: 3px; background: linear-gradient(90deg, #cba6f7 0 34%, #89b4fa 34% 67%, #a6e3a1 67%); }
      .logo { display: block; width: 100%; height: auto; background: #05031d; border-bottom: 1px solid #313244; }
      .header, .content, .footer { padding: 28px 32px; }
      .kicker, .dispatch-eyebrow { margin: 0 0 6px; color: #a6e3a1; font-family: Consolas, monospace; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
      h1 { margin: 0 0 10px; color: #f5e8ff; font-size: 32px; line-height: 1.2; }
      .lede { margin: 0; color: #b4c9ff; font-size: 16px; line-height: 1.6; }
      .greeting { margin: 0 0 22px; padding: 16px 18px; border-left: 4px solid #cba6f7; border-radius: 0 9px 9px 0; background: #313244; }
      .content { border-top: 1px solid #313244; }
      .content h2 { margin: 0 0 12px; color: #cdd6f4; font-size: 24px; line-height: 1.3; }
      .content h3 { margin: 24px 0 10px; padding: 12px 14px; border-left: 4px solid #89b4fa; border-radius: 0 8px 8px 0; background: #313244; color: #cdd6f4; font-size: 18px; line-height: 1.4; }
      .content p { margin: 0 0 16px; color: #bac2de; font-size: 15px; line-height: 1.65; }
      .content hr { height: 1px; margin: 30px 0; border: 0; background: #45475a; }
      .content .dispatch-eyebrow { margin-top: 0; color: #cba6f7; }
      .content .dispatch-eyebrow--blue { color: #89b4fa; }
      .content .dispatch-eyebrow--green { color: #a6e3a1; }
      .content .dispatch-eyebrow--yellow { color: #f9e2af; }
      .footer { border-top: 1px solid #313244; background: #181825; color: #a6adc8; font-size: 12px; line-height: 1.6; text-align: center; }
      .footer p { margin: 0 0 8px; }
      @media (max-width: 560px) { .header, .content, .footer { padding: 22px 20px; } h1 { font-size: 27px; } }
    </style>
  </head>
  <body>
    ${previewBanner}
    <main class="shell">
      <div class="accent"></div>
      <img class="logo" src="${emailLogoUrl}" width="640" alt="The Defender’s Dispatch — A CybersecKyle newsletter" />
      <header class="header">
        <p class="kicker">Issue ${escapeHtml(data.issueNumber)} · ${escapeHtml(data.issueDateLabel)}</p>
        <h1>${escapeHtml(data.title)}</h1>
        <p class="lede">${escapeHtml(data.emailPreview)}</p>
      </header>
      <section class="content">
        <p class="greeting">Hi {{{contact.first_name|there}}},</p>
        ${renderedIssue}
      </section>
      <footer class="footer">
        <p><strong>The Defender’s Dispatch</strong></p>
        <p>A CybersecKyle newsletter · <a href="${siteOrigin}/newsletter/archive/">Read the archive</a> · <a href="mailto:newsletter@kylereddoch.me">Reply to Kyle</a></p>
        <p>You’re receiving this because you subscribed to The Defender’s Dispatch.</p>
        <p><a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></p>
      </footer>
    </main>
    ${trackingPixel}
  </body>
</html>`;

fs.mkdirSync(outputRoot, {recursive: true});
const suffix = productionMode ? 'email' : 'preview';
const outputPath = path.join(outputRoot, `${path.basename(issuePath, '.md')}.${suffix}.html`);
fs.writeFileSync(outputPath, html, 'utf8');

console.log(
  `Rendered ${path.relative(projectRoot, outputPath)} from ${path.relative(projectRoot, issuePath)}.`
);
if (!productionMode)
  console.log('Local preview mode: no network requests were made and no tracking pixel was included.');
