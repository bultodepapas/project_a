import * as fs from 'fs';
import * as path from 'path';
import { defaultLocale, supportedLocales } from '../../config/locales.mjs';
import type { Validator, ValidatorContext, ValidationMessage } from './core/types';
import { isRecord } from './core/utils';

const LOCALES = supportedLocales;

function validateFile(filePath: string): object | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function findMissingKeys(source: object, target: object, prefix = ''): string[] {
  const missing: string[] = [];

  for (const key of Object.keys(source)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const sourceValue = (source as Record<string, unknown>)[key];
    const targetValue = (target as Record<string, unknown>)[key];

    if (targetValue === undefined) {
      missing.push(fullKey);
    } else if (isRecord(sourceValue)) {
      if (isRecord(targetValue)) {
        missing.push(...findMissingKeys(sourceValue, targetValue, fullKey));
      }
    }
  }

  return missing;
}

export const i18nValidator: Validator = {
  name: 'i18n Integrity',
  validate(context: ValidatorContext): ValidationMessage[] {
    const messages: ValidationMessage[] = [];
    const { rootDir } = context;
    const I18N_DIR = path.join(rootDir, 'src', 'i18n');

    const canonicalLocale = defaultLocale;
    const canonicalPath = path.join(I18N_DIR, `${canonicalLocale}.json`);

    if (!fs.existsSync(canonicalPath)) {
      messages.push({
        level: 'error',
        location: `i18n/${canonicalLocale}.json`,
        message: `Canonical translation file is missing (${canonicalLocale})`,
      });
      return messages;
    }

    const canonicalData = validateFile(canonicalPath);
    if (!canonicalData) {
      messages.push({
        level: 'error',
        location: `i18n/${canonicalLocale}.json`,
        message: `Invalid JSON in canonical translation file (${canonicalLocale})`,
      });
      return messages;
    }

    LOCALES.forEach((locale) => {
      const localePath = path.join(I18N_DIR, `${locale}.json`);
      if (!fs.existsSync(localePath)) {
        messages.push({
          level: 'error',
          location: `i18n/${locale}.json`,
          message: `Translation file is missing (${locale})`,
        });
        return;
      }

      const localeData = validateFile(localePath);
      if (!localeData) {
        messages.push({
          level: 'error',
          location: `i18n/${locale}.json`,
          message: `Invalid JSON in translation file (${locale})`,
        });
        return;
      }

      if (locale !== canonicalLocale) {
        const missingKeys = findMissingKeys(canonicalData as object, localeData as object);
        if (missingKeys.length > 0) {
          messages.push({
            level: 'warning',
            location: `i18n/${locale}.json`,
            message: `Missing translation keys: ${missingKeys.slice(0, 5).join(', ')}${
              missingKeys.length > 5 ? ` and ${missingKeys.length - 5} more` : ''
            }`,
          });
        }
      }
    });

    return messages;
  },
};
