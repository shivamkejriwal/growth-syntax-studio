// src/services/parseUtils.ts

import { Transform, TransformCallback } from 'stream';

/**
 * Converts a string value to a boolean, or returns undefined if not valid.
 */
export const toBoolean = (value: string | undefined | null): boolean | undefined => {
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true' || lowerValue === '1') return true;
    if (lowerValue === 'false' || lowerValue === '0') return false;
  }
  return undefined; // Or false by default if preferred
};

/**
 * Converts a string value to a number, or returns undefined if not a valid number.
 */
export const toNumber = (value: string | undefined | null): number | undefined => {
  if (value === null || value === undefined || value.trim() === '') {
    return undefined;
  }
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};
