/**
 * Content Validation Script
 * Validates all content files meet requirements before build
 * Run: npm run validate
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { defaultLocale, supportedLocales } from '../config/locales.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationError {
  type: 'error' | 'warning';
  location: string;
  message: string;
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
}

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const I18N_DIR = path.join(ROOT_DIR, 'src', 'i18n');
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content');
const CASES_DIR = path.join(CONTENT_DIR, 'cases');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

const LOCALES = supportedLocales;

// Validation rules
const RULES = {
  proofStrip: {
    maxItems: 5,
  },
  capabilities: {
    maxBlocks: 6,
  },
  experience: {
    maxBulletsPerRole: 3,
  },
  caseStudy: {
    minDecisionImpacts: 3,
    requiredFields: ['caseSlug', 'title', 'problem', 'approach', 'decisionImpact', 'adoption', 'governance'],
  },
  article: {
    requiredFields: ['title', 'articleSlug', 'lang', 'publishDate', 'category', 'excerpt', 'readTime'],
  },
  page: {
    requiredFields: ['pageSlug', 'lang', 'title', 'description'],
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validateLocaleRecord(
  value: unknown,
  location: string,
  errors: ValidationError[]
): value is Record<string, string> {
  if (!isRecord(value)) {
    errors.push({
      type: 'error',
      location,
      message: 'Expected an object with locale keys',
    });
    return false;
  }

  LOCALES.forEach((locale) => {
    if (!(locale in value)) {
      errors.push({
        type: 'error',
        location: `${location}.${locale}`,
        message: 'Missing locale key',
      });
    } else if (typeof value[locale] !== 'string') {
      errors.push({
        type: 'error',
        location: `${location}.${locale}`,
        message: 'Locale value must be a string',
      });
    }
  });

  return true;
}

function validateLocaleArrayRecord(
  value: unknown,
  location: string,
  errors: ValidationError[]
): value is Record<string, string[]> {
  if (!isRecord(value)) {
    errors.push({
      type: 'error',
      location,
      message: 'Expected an object with locale keys',
    });
    return false;
  }

  LOCALES.forEach((locale) => {
    if (!(locale in value)) {
      errors.push({
        type: 'error',
        location: `${location}.${locale}`,
        message: 'Missing locale key',
      });
    } else if (!isStringArray(value[locale])) {
      errors.push({
        type: 'error',
        location: `${location}.${locale}`,
        message: 'Locale value must be an array of strings',
      });
    }
  });

  return true;
}

function validateFile(filePath: string): object | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function validateI18n(): ValidationError[] {
  const errors: ValidationError[] = [];

  const canonicalLocale = defaultLocale;
  const canonicalPath = path.join(I18N_DIR, `${canonicalLocale}.json`);

  if (!fs.existsSync(canonicalPath)) {
    errors.push({
      type: 'error',
      location: `i18n/${canonicalLocale}.json`,
      message: `Canonical translation file is missing (${canonicalLocale})`,
    });
    return errors;
  }

  const canonicalData = validateFile(canonicalPath);
  if (!canonicalData) {
    errors.push({
      type: 'error',
      location: `i18n/${canonicalLocale}.json`,
      message: `Invalid JSON in canonical translation file (${canonicalLocale})`,
    });
    return errors;
  }

  LOCALES.forEach((locale) => {
    const localePath = path.join(I18N_DIR, `${locale}.json`);
    if (!fs.existsSync(localePath)) {
      errors.push({
        type: 'error',
        location: `i18n/${locale}.json`,
        message: `Translation file is missing (${locale})`,
      });
      return;
    }

    const localeData = validateFile(localePath);
    if (!localeData) {
      errors.push({
        type: 'error',
        location: `i18n/${locale}.json`,
        message: `Invalid JSON in translation file (${locale})`,
      });
      return;
    }

    if (locale !== canonicalLocale) {
      const missingKeys = findMissingKeys(canonicalData as object, localeData as object);
      if (missingKeys.length > 0) {
        errors.push({
          type: 'warning',
          location: `i18n/${locale}.json`,
          message: `Missing translation keys: ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? ` and ${missingKeys.length - 5} more` : ''}`,
        });
      }
    }
  });

  return errors;
}

function findMissingKeys(source: object, target: object, prefix = ''): string[] {
  const missing: string[] = [];

  for (const key of Object.keys(source)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const sourceValue = (source as Record<string, unknown>)[key];
    const targetValue = (target as Record<string, unknown>)[key];

    if (targetValue === undefined) {
      missing.push(fullKey);
    } else if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
      if (typeof targetValue === 'object' && targetValue !== null) {
        missing.push(...findMissingKeys(sourceValue as object, targetValue as object, fullKey));
      }
    }
  }

  return missing;
}

function validateDataFiles(): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    errors.push({
      type: 'warning',
      location: 'src/data',
      message: 'Data directory does not exist yet. Will be created in Sprint 1.',
    });
    return errors;
  }

  // Validate site.json if exists
  const sitePath = path.join(DATA_DIR, 'site.json');
  if (fs.existsSync(sitePath)) {
    const site = validateFile(sitePath) as Record<string, unknown> | null;
    if (!site) {
      errors.push({
        type: 'error',
        location: 'data/site.json',
        message: 'Invalid JSON in site data file',
      });
    } else {
      if (typeof site.name !== 'string') {
        errors.push({
          type: 'error',
          location: 'data/site.json#name',
          message: 'Site name must be a string',
        });
      }
      if (typeof site.email !== 'string') {
        errors.push({
          type: 'error',
          location: 'data/site.json#email',
          message: 'Site email must be a string',
        });
      }
      if (typeof site.linkedin !== 'string') {
        errors.push({
          type: 'error',
          location: 'data/site.json#linkedin',
          message: 'Site linkedin must be a string',
        });
      }
      validateLocaleRecord(site.jobTitle, 'data/site.json#jobTitle', errors);
      validateLocaleRecord(site.tagline, 'data/site.json#tagline', errors);
      validateLocaleRecord(site.location, 'data/site.json#location', errors);
      validateLocaleRecord(site.pdf, 'data/site.json#pdf', errors);
    }
  }

  // Validate home.json if exists
  const homePath = path.join(DATA_DIR, 'home.json');
  if (fs.existsSync(homePath)) {
    const home = validateFile(homePath) as Record<string, unknown> | null;
    if (!home) {
      errors.push({
        type: 'error',
        location: 'data/home.json',
        message: 'Invalid JSON in home data file',
      });
    } else {
      if (!isRecord(home.hero) || !Array.isArray(home.hero.chips)) {
        errors.push({
          type: 'error',
          location: 'data/home.json#hero.chips',
          message: 'Hero chips must be an array',
        });
      } else {
        home.hero.chips.forEach((chip, index) => {
          validateLocaleRecord(chip, `data/home.json#hero.chips.${index}`, errors);
        });
      }

      if (!isRecord(home.hiredFor) || !Array.isArray(home.hiredFor.items)) {
        errors.push({
          type: 'error',
          location: 'data/home.json#hiredFor.items',
          message: 'HiredFor items must be an array',
        });
      } else {
        home.hiredFor.items.forEach((item, index) => {
          validateLocaleRecord(
            (item as Record<string, unknown>).metricLabel,
            `data/home.json#hiredFor.items.${index}.metricLabel`,
            errors
          );
          const highlights = (item as Record<string, unknown>).highlights;
          if (Array.isArray(highlights)) {
            highlights.forEach((highlight, highlightIndex) => {
              validateLocaleRecord(
                highlight,
                `data/home.json#hiredFor.items.${index}.highlights.${highlightIndex}`,
                errors
              );
            });
          }
        });
      }

      if (!isRecord(home.systems) || !Array.isArray(home.systems.cards)) {
        errors.push({
          type: 'error',
          location: 'data/home.json#systems.cards',
          message: 'Systems cards must be an array',
        });
      } else {
        home.systems.cards.forEach((card, index) => {
          validateLocaleRecord(
            (card as Record<string, unknown>).title,
            `data/home.json#systems.cards.${index}.title`,
            errors
          );
          validateLocaleRecord(
            (card as Record<string, unknown>).description,
            `data/home.json#systems.cards.${index}.description`,
            errors
          );
          const features = (card as Record<string, unknown>).features;
          if (Array.isArray(features)) {
            features.forEach((feature, featureIndex) => {
              validateLocaleRecord(
                feature,
                `data/home.json#systems.cards.${index}.features.${featureIndex}`,
                errors
              );
            });
          }
        });
      }

      if (!isRecord(home.operatingModel)) {
        errors.push({
          type: 'error',
          location: 'data/home.json#operatingModel',
          message: 'Operating model must be an object',
        });
      } else {
        const nodes = home.operatingModel.nodes;
        const edges = home.operatingModel.edges;
        if (Array.isArray(nodes)) {
          nodes.forEach((node, index) => {
            validateLocaleRecord(
              (node as Record<string, unknown>).label,
              `data/home.json#operatingModel.nodes.${index}.label`,
              errors
            );
            validateLocaleRecord(
              (node as Record<string, unknown>).description,
              `data/home.json#operatingModel.nodes.${index}.description`,
              errors
            );
          });
        }
        if (Array.isArray(edges)) {
          edges.forEach((edge, index) => {
            const label = (edge as Record<string, unknown>).label;
            if (label) {
              validateLocaleRecord(
                label,
                `data/home.json#operatingModel.edges.${index}.label`,
                errors
              );
            }
          });
        }
      }
    }
  }

  // Validate proof.json if exists
  const proofPath = path.join(DATA_DIR, 'proof.json');
  if (fs.existsSync(proofPath)) {
    const proof = validateFile(proofPath) as { items?: Array<{ href?: string }> } | null;
    if (!proof) {
      errors.push({
        type: 'error',
        location: 'data/proof.json',
        message: 'Invalid JSON in proof data file',
      });
    }
    if (proof?.items) {
      if (proof.items.length > RULES.proofStrip.maxItems) {
        errors.push({
          type: 'error',
          location: 'data/proof.json',
          message: `Proof strip has ${proof.items.length} items, max is ${RULES.proofStrip.maxItems}`,
        });
      }
      proof.items.forEach((item, index) => {
        if (!item.href) {
          errors.push({
            type: 'error',
            location: `data/proof.json#${index + 1}`,
            message: 'Proof item is missing href',
          });
        }
        const itemRecord = item as Record<string, unknown>;
        if ('title' in itemRecord) {
          validateLocaleRecord(itemRecord.title, `data/proof.json#${index + 1}.title`, errors);
        }
        if ('detail' in itemRecord) {
          validateLocaleRecord(itemRecord.detail, `data/proof.json#${index + 1}.detail`, errors);
        }
      });
    }
  }

  // Validate skills.json if exists
  const skillsPath = path.join(DATA_DIR, 'skills.json');
  if (fs.existsSync(skillsPath)) {
    const skills = validateFile(skillsPath) as { capabilities?: Array<{ caseLink?: string }> } | null;
    if (!skills) {
      errors.push({
        type: 'error',
        location: 'data/skills.json',
        message: 'Invalid JSON in skills data file',
      });
    }
    if (skills?.capabilities) {
      if (skills.capabilities.length > RULES.capabilities.maxBlocks) {
        errors.push({
          type: 'error',
          location: 'data/skills.json',
          message: `Capabilities has ${skills.capabilities.length} items, max is ${RULES.capabilities.maxBlocks}`,
        });
      }
      skills.capabilities.forEach((capability, index) => {
        if (!capability.caseLink) {
          errors.push({
            type: 'warning',
            location: `data/skills.json#${index + 1}`,
            message: 'Capability missing caseLink',
          });
        }
        const capabilityRecord = capability as Record<string, unknown>;
        validateLocaleRecord(
          capabilityRecord.name,
          `data/skills.json#${index + 1}.name`,
          errors
        );
        validateLocaleRecord(
          capabilityRecord.evidence,
          `data/skills.json#${index + 1}.evidence`,
          errors
        );
      });
    }
  }

  // Validate experience.json if exists
  const experiencePath = path.join(DATA_DIR, 'experience.json');
  if (fs.existsSync(experiencePath)) {
    const experience = validateFile(experiencePath) as
      | { roles?: Array<{ bullets?: { en?: string[]; es?: string[] } }> }
      | null;
    if (!experience) {
      errors.push({
        type: 'error',
        location: 'data/experience.json',
        message: 'Invalid JSON in experience data file',
      });
    }
    if (experience?.roles) {
      experience.roles.forEach((role, index) => {
        const roleRecord = role as Record<string, unknown>;
        validateLocaleRecord(
          roleRecord.title,
          `data/experience.json#${index + 1}.title`,
          errors
        );
        validateLocaleArrayRecord(
          roleRecord.bullets,
          `data/experience.json#${index + 1}.bullets`,
          errors
        );
        const enBullets = role.bullets?.en || [];
        const esBullets = role.bullets?.es || [];
        if (enBullets.length > RULES.experience.maxBulletsPerRole) {
          errors.push({
            type: 'warning',
            location: `data/experience.json#${index + 1}`,
            message: `Role has ${enBullets.length} EN bullets, max is ${RULES.experience.maxBulletsPerRole}`,
          });
        }
        if (esBullets.length > RULES.experience.maxBulletsPerRole) {
          errors.push({
            type: 'warning',
            location: `data/experience.json#${index + 1}`,
            message: `Role has ${esBullets.length} ES bullets, max is ${RULES.experience.maxBulletsPerRole}`,
          });
        }
      });
    }
  }

  // Validate education.json if exists
  const educationPath = path.join(DATA_DIR, 'education.json');
  if (fs.existsSync(educationPath)) {
    const education = validateFile(educationPath) as Record<string, unknown> | null;
    if (!education) {
      errors.push({
        type: 'error',
        location: 'data/education.json',
        message: 'Invalid JSON in education data file',
      });
    } else if (Array.isArray(education.items)) {
      education.items.forEach((item, index) => {
        const itemRecord = item as Record<string, unknown>;
        validateLocaleRecord(
          itemRecord.degree,
          `data/education.json#${index + 1}.degree`,
          errors
        );
        validateLocaleRecord(
          itemRecord.field,
          `data/education.json#${index + 1}.field`,
          errors
        );
        validateLocaleArrayRecord(
          itemRecord.highlights,
          `data/education.json#${index + 1}.highlights`,
          errors
        );
        validateLocaleRecord(
          itemRecord.backContent,
          `data/education.json#${index + 1}.backContent`,
          errors
        );
        const achievement = itemRecord.achievement;
        if (achievement && isRecord(achievement)) {
          validateLocaleRecord(
            achievement.label,
            `data/education.json#${index + 1}.achievement.label`,
            errors
          );
        }
      });
    }
  }

  // Validate languages.json if exists
  const languagesPath = path.join(DATA_DIR, 'languages.json');
  if (fs.existsSync(languagesPath)) {
    const languages = validateFile(languagesPath) as Record<string, unknown> | null;
    if (!languages) {
      errors.push({
        type: 'error',
        location: 'data/languages.json',
        message: 'Invalid JSON in languages data file',
      });
    } else if (Array.isArray(languages.items)) {
      languages.items.forEach((item, index) => {
        const itemRecord = item as Record<string, unknown>;
        validateLocaleRecord(
          itemRecord.usedFor,
          `data/languages.json#${index + 1}.usedFor`,
          errors
        );
      });
    }
  }

  // Validate awards.json if exists
  const awardsPath = path.join(DATA_DIR, 'awards.json');
  if (fs.existsSync(awardsPath)) {
    const awards = validateFile(awardsPath) as Record<string, unknown> | null;
    if (!awards) {
      errors.push({
        type: 'error',
        location: 'data/awards.json',
        message: 'Invalid JSON in awards data file',
      });
    } else if (Array.isArray(awards.items)) {
      awards.items.forEach((item, index) => {
        const itemRecord = item as Record<string, unknown>;
        validateLocaleRecord(
          itemRecord.title,
          `data/awards.json#${index + 1}.title`,
          errors
        );
        validateLocaleRecord(
          itemRecord.description,
          `data/awards.json#${index + 1}.description`,
          errors
        );
        validateLocaleArrayRecord(
          itemRecord.highlights,
          `data/awards.json#${index + 1}.highlights`,
          errors
        );
        const org = itemRecord.org;
        if (org && isRecord(org)) {
          validateLocaleRecord(
            org,
            `data/awards.json#${index + 1}.org`,
            errors
          );
        }
      });
    }
  }

  return errors;
}

function validateCasesContent(): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!fs.existsSync(CASES_DIR)) {
    errors.push({
      type: 'warning',
      location: 'src/content/cases',
      message: 'Cases content directory is missing',
    });
    return errors;
  }

  const caseFiles = fs.readdirSync(CASES_DIR).filter((file) => file.endsWith('.mdx'));
  if (caseFiles.length === 0) {
    errors.push({
      type: 'warning',
      location: 'src/content/cases',
      message: 'No case study MDX files found',
    });
    return errors;
  }

  caseFiles.forEach((fileName) => {
    const fullPath = path.join(CASES_DIR, fileName);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;

    RULES.caseStudy.requiredFields.forEach((field) => {
      if (!(field in data)) {
        errors.push({
          type: 'error',
          location: `content/cases/${fileName}`,
          message: `Case missing required field: ${field}`,
        });
      }
    });

    const decisionImpact = data.decisionImpact as unknown[] | undefined;
    if (Array.isArray(decisionImpact) && decisionImpact.length < RULES.caseStudy.minDecisionImpacts) {
      errors.push({
        type: 'error',
        location: `content/cases/${fileName}`,
        message: `Decision impact has ${decisionImpact.length} items, min is ${RULES.caseStudy.minDecisionImpacts}`,
      });
    }
  });

  return errors;
}

function validateContentDirectory(
  dirPath: string,
  label: string,
  extension: string,
  requiredFields: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!fs.existsSync(dirPath)) {
    errors.push({
      type: 'warning',
      location: `src/content/${label}`,
      message: `${label} content directory is missing`,
    });
    return errors;
  }

  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(extension));
  if (files.length === 0) {
    errors.push({
      type: 'warning',
      location: `src/content/${label}`,
      message: `No ${label} content files found`,
    });
    return errors;
  }

  files.forEach((fileName) => {
    const fullPath = path.join(dirPath, fileName);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;

    requiredFields.forEach((field) => {
      if (!(field in data)) {
        errors.push({
          type: 'error',
          location: `content/${label}/${fileName}`,
          message: `Missing required field: ${field}`,
        });
      }
    });
  });

  return errors;
}

function validateProjectStructure(): ValidationError[] {
  const errors: ValidationError[] = [];

  const requiredFiles = [
    'package.json',
    'astro.config.mjs',
    'tsconfig.json',
    'tailwind.config.mjs',
    'src/layouts/Base.astro',
    'src/layouts/Page.astro',
    'src/styles/global.css',
    'src/styles/tokens.css',
    'src/i18n/index.ts',
    'src/i18n/en.json',
    'src/content/config.ts',
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(filePath)) {
      errors.push({
        type: 'error',
        location: file,
        message: `Required file is missing: ${file}`,
      });
    }
  }

  return errors;
}

async function main() {
  console.log('\nContent Validation Report\n');
  console.log('='.repeat(50));

  const result: ValidationResult = {
    errors: [],
    warnings: [],
  };

  // Run all validations
  const structureErrors = validateProjectStructure();
  const i18nErrors = validateI18n();
  const dataErrors = validateDataFiles();
  const caseErrors = validateCasesContent();
  const articleErrors = validateContentDirectory(
    ARTICLES_DIR,
    'articles',
    '.mdx',
    RULES.article.requiredFields
  );
  const pageErrors = validateContentDirectory(
    PAGES_DIR,
    'pages',
    '.md',
    RULES.page.requiredFields
  );

  const allErrors = [
    ...structureErrors,
    ...i18nErrors,
    ...dataErrors,
    ...caseErrors,
    ...articleErrors,
    ...pageErrors,
  ];

  // Categorize
  for (const error of allErrors) {
    if (error.type === 'error') {
      result.errors.push(error);
    } else {
      result.warnings.push(error);
    }
  }

  // Report errors
  if (result.errors.length > 0) {
    console.log('\nERRORS:\n');
    for (const error of result.errors) {
      console.log(`  [${error.location}]`);
      console.log(`    ${error.message}\n`);
    }
  }

  // Report warnings
  if (result.warnings.length > 0) {
    console.log('\nWARNINGS:\n');
    for (const warning of result.warnings) {
      console.log(`  [${warning.location}]`);
      console.log(`    ${warning.message}\n`);
    }
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`\nSummary: ${result.errors.length} errors, ${result.warnings.length} warnings\n`);

  if (result.errors.length === 0) {
    console.log('Validation passed.\n');
    process.exit(0);
  } else {
    console.log('Validation failed. Please fix errors before building.\n');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Validation script error:', error);
  process.exit(1);
});
