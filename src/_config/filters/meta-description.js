const decodeEntities = value =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

const truncateAtWord = (value, maxLength) => {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, maxLength + 1);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace < maxLength * 0.6) {
    return `${value.slice(0, maxLength).trim()}...`;
  }

  return `${truncated.slice(0, lastSpace).trim()}...`;
};

export const metaDescription = (value, maxLength = 160) => {
  const source = String(value || '');

  if (!source.trim()) return '';

  const contentMatch = source.match(/<div[^>]+class="[^"]*\be-content\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const content = contentMatch ? contentMatch[1] : source;

  const description = decodeEntities(content)
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[\s>#+*-]+/gm, ' ')
    .replace(/[_*~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return truncateAtWord(description, Number(maxLength) || 160);
};
