import sanitizeHtml from 'sanitize-html';

const allowedCaptionHtml = {
  allowedTags: ['a', 'br', 'cite', 'em', 'strong'],
  allowedAttributes: {
    a: ['href', 'rel', 'target', 'title']
  },
  allowedSchemes: ['http', 'https'],
  transformTags: {
    a(tagName, attribs) {
      return {
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: '_blank'
        }
      };
    }
  }
};

export const featuredImageCaptionHtml = value => {
  if (!value) return '';

  return sanitizeHtml(String(value), allowedCaptionHtml);
};
