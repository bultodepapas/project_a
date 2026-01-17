/**
 * Content Validation Script
 * Validates all content files meet requirements before build
 * Run: npm run validate
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

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
    requiredFields: ['title', 'problem', 'approach', 'decisionImpact', 'adoption', 'governance'],
  },
};

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

  const enPath = path.join(I18N_DIR, 'en.json');
  const esPath = path.join(I18N_DIR, 'es.json');

  if (!fs.existsSync(enPath)) {
    errors.push({
      type: 'error',
      location: 'i18n/en.json',
      message: 'English translation file is missing',
    });
    return errors;
  }

  if (!fs.existsSync(esPath)) {
    errors.push({
      type: 'warning',
      location: 'i18n/es.json',
      message: 'Spanish translation file is missing',
    });
  }

  const en = validateFile(enPath);
  const es = validateFile(esPath);

  if (!en) {
    errors.push({
      type: 'error',
      location: 'i18n/en.json',
      message: 'Invalid JSON in English translation file',
    });
  }

  if (es === null && fs.existsSync(esPath)) {
    errors.push({
      type: 'error',
      location: 'i18n/es.json',
      message: 'Invalid JSON in Spanish translation file',
    });
  }

  // Check for missing keys in ES compared to EN
  if (en && es) {
    const missingKeys = findMissingKeys(en as object, es as object);
    if (missingKeys.length > 0) {
      errors.push({
        type: 'warning',
        location: 'i18n/es.json',
        message: `Missing translation keys: ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? ` and ${missingKeys.length - 5} more` : ''}`,
      });
    }
  }

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

  // Validate proof.json if exists
  const proofPath = path.join(DATA_DIR, 'proof.json');
  if (fs.existsSync(proofPath)) {
    const proof = validateFile(proofPath) as { items?: unknown[] } | null;
    if (proof?.items) {
      if (proof.items.length > RULES.proofStrip.maxItems) {
        errors.push({
          type: 'error',
          location: 'data/proof.json',
          message: `Proof strip has ${proof.items.length} items, max is ${RULES.proofStrip.maxItems}`,
        });
      }
    }
  }

  // Validate skills.json if exists
  const skillsPath = path.join(DATA_DIR, 'skills.json');
  if (fs.existsSync(skillsPath)) {
    const skills = validateFile(skillsPath) as { capabilities?: unknown[] } | null;
    if (skills?.capabilities) {
      if (skills.capabilities.length > RULES.capabilities.maxBlocks) {
        errors.push({
          type: 'error',
          location: 'data/skills.json',
          message: `Capabilities has ${skills.capabilities.length} items, max is ${RULES.capabilities.maxBlocks}`,
        });
      }
    }
  }

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
  console.log('\n📋 Content Validation Report\n');
  console.log('='.repeat(50));

  const result: ValidationResult = {
    errors: [],
    warnings: [],
  };

  // Run all validations
  const structureErrors = validateProjectStructure();
  const i18nErrors = validateI18n();
  const dataErrors = validateDataFiles();

  const allErrors = [...structureErrors, ...i18nErrors, ...dataErrors];

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
    console.log('\n❌ ERRORS:\n');
    for (const error of result.errors) {
      console.log(`  [${error.location}]`);
      console.log(`    ${error.message}\n`);
    }
  }

  // Report warnings
  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:\n');
    for (const warning of result.warnings) {
      console.log(`  [${warning.location}]`);
      console.log(`    ${warning.message}\n`);
    }
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`\n📊 Summary: ${result.errors.length} errors, ${result.warnings.length} warnings\n`);

  if (result.errors.length === 0) {
    console.log('✅ Validation passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Validation failed. Please fix errors before building.\n');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Validation script error:', error);
  process.exit(1);
});
