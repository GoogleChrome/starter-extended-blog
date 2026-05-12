/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a date string for the preview.
 * @param {string} dateStr - The date string from the input.
 * @param {string} [locale='en'] - BCP 47 locale tag for formatting.
 * @return {string} The formatted date string.
 */
export function formatPreviewDate(dateStr, locale = 'en') {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
