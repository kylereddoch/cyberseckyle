import { markdownLib } from '../plugins/markdown.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

export const articleCallout = (content, title = 'In practice', tone = 'note') => {
  const variant = ['note', 'example', 'caution'].includes(tone) ? tone : 'note';
  return `<aside class="article-callout article-callout--${variant}" aria-label="${escapeHtml(title)}"><p class="article-callout__title">${escapeHtml(title)}</p>${markdownLib.render(content.trim())}</aside>`;
};

export const articleDetails = (content, title = 'See the example') =>
  `<details class="article-details"><summary>${escapeHtml(title)}</summary><div class="article-details__body">${markdownLib.render(content.trim())}</div></details>`;

export const articleSteps = (title, steps = []) =>
  `<figure class="article-diagram"><figcaption>${escapeHtml(title)}</figcaption><ol class="article-steps">${steps.map(step => `<li><strong>${escapeHtml(step.title)}</strong><span>${escapeHtml(step.text)}</span></li>`).join('')}</ol></figure>`;
