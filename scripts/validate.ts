import * as path from 'path';
import { fileURLToPath } from 'url';
import { projectStructureValidator } from './validators/project-structure';
import { i18nValidator } from './validators/i18n';
import { dataValidator } from './validators/content-data';
import { mdxValidator } from './validators/content-mdx';
import type { ValidationMessage, ValidatorContext } from './validators/core/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('\nContent Validation Report (Modular)\n');
  console.log('='.repeat(50));

  const context: ValidatorContext = {
    rootDir: path.resolve(__dirname, '..'),
  };

  const validators = [
    projectStructureValidator,
    i18nValidator,
    dataValidator,
    mdxValidator,
  ];

  const allMessages: ValidationMessage[] = [];

  for (const validator of validators) {
    try {
      // console.log(`Running validator: ${validator.name}...`);
      const messages = await validator.validate(context);
      allMessages.push(...messages);
    } catch (e: any) {
      allMessages.push({
        level: 'error',
        location: validator.name,
        message: `Validator crashed: ${e.message}`,
      });
    }
  }

  const errors = allMessages.filter((m) => m.level === 'error');
  const warnings = allMessages.filter((m) => m.level === 'warning');

  // Report errors
  if (errors.length > 0) {
    console.log('\nERRORS:\n');
    for (const error of errors) {
      console.log(`  [${error.location}]`);
      console.log(`    ${error.message}\n`);
    }
  }

  // Report warnings
  if (warnings.length > 0) {
    console.log('\nWARNINGS:\n');
    for (const warning of warnings) {
      console.log(`  [${warning.location}]`);
      console.log(`    ${warning.message}\n`);
    }
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`\nSummary: ${errors.length} errors, ${warnings.length} warnings\n`);

  if (errors.length === 0) {
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
