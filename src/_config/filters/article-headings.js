import sanitizeHtml from 'sanitize-html';

// Read the IDs already assigned by Markdown, including custom IDs. Parsing the
// rendered HTML avoids inventing anchors that disagree with the article.
export const articleHeadings = html => {
  const headings = [];
  const seen = new Set();
  let detailsDepth = 0;
  sanitizeHtml(String(html || ''), {
    allowedTags: ['h2', 'em', 'strong', 'code', 'span', 'a'],
    allowedAttributes: { h2: ['id'] },
    onOpenTag(tag) {
      if (tag === 'details') detailsDepth++;
    },
    onCloseTag(tag) {
      if (tag === 'details') detailsDepth--;
    },
    exclusiveFilter(frame) {
      if (detailsDepth || frame.tag !== 'h2' || !frame.attribs.id || seen.has(frame.attribs.id)) return false;
      const text = frame.text.replace(/\s+/g, ' ').trim();
      if (text) {
        headings.push({ id: frame.attribs.id, href: `#${encodeURIComponent(frame.attribs.id)}`, text });
        seen.add(frame.attribs.id);
      }
      return false;
    }
  });
  return headings;
};
