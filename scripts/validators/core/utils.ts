import { supportedLocales } from '../../../config/locales.mjs';
import type { ValidationMessage } from './types';

const LOCALES = supportedLocales;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function validateLocaleRecord(
  value: unknown,
  location: string,
  messages: ValidationMessage[]
): value is Record<string, string> {
  if (!isRecord(value)) {
    messages.push({
      level: 'error',
      location,
      message: 'Expected an object with locale keys',
    });
    return false;
  }

  LOCALES.forEach((locale) => {
    if (!(locale in value)) {
      messages.push({
        level: 'error',
        location: `${location}.${locale}`,
        message: 'Missing locale key',
      });
    } else if (typeof value[locale] !== 'string') {
      messages.push({
        level: 'error',
        location: `${location}.${locale}`,
        message: 'Locale value must be a string',
      });
    }
  });

  return true;
}

export function validateLocaleArrayRecord(
  value: unknown,
  location: string,
  messages: ValidationMessage[]
): value is Record<string, string[]> {
  if (!isRecord(value)) {
    messages.push({
      level: 'error',
      location,
      message: 'Expected an object with locale keys',
    });
    return false;
  }

  LOCALES.forEach((locale) => {
    if (!(locale in value)) {
      messages.push({
        level: 'error',
        location: `${location}.${locale}`,
        message: 'Missing locale key',
      });
    } else if (!isStringArray(value[locale])) {
      messages.push({
        level: 'error',
        location: `${location}.${locale}`,
        message: 'Locale value must be an array of strings',
      });
    }
  });

  return true;
}
