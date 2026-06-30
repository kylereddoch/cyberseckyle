import dayjs from 'dayjs';

const SITE_TIME_ZONE = 'America/Chicago';

export const getPublishedDate = item => {
  const candidate =
    item?.data?.publishedAt ||
    item?.data?.published_at ||
    item?.data?.actualPublishedAt ||
    item?.data?.actual_published_at ||
    item?.date ||
    item;
  const date = new Date(candidate);

  return Number.isNaN(date.getTime()) ? item?.date : date;
};

const dateTimeParts = date => new Intl.DateTimeFormat('en-US', {
  timeZone: SITE_TIME_ZONE,
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
}).formatToParts(date);

const getDateTimePart = (parts, type) => parts.find(part => part.type === type)?.value || '';

/** Converts the given date string to ISO8610 format. */
export const toISOString = dateString => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
export const formatDate = (date, format) => dayjs(date).format(format);

/** Formats article dates with Central time, for example: May 26, 2026, 11:30am. */
export const formatArticleDateTime = date => {
  const parts = dateTimeParts(getPublishedDate(date));
  const month = getDateTimePart(parts, 'month');
  const day = getDateTimePart(parts, 'day');
  const year = getDateTimePart(parts, 'year');
  const hour = getDateTimePart(parts, 'hour');
  const minute = getDateTimePart(parts, 'minute');
  const dayPeriod = getDateTimePart(parts, 'dayPeriod').toLowerCase();

  return `${month} ${day}, ${year} at ${hour}:${minute}${dayPeriod}`;
};
