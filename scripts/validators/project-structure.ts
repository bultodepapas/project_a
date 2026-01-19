import * as fs from 'fs';
import * as path from 'path';
import type { Validator, ValidatorContext, ValidationMessage } from './core/types';

export const projectStructureValidator: Validator = {
  name: 'Project Structure',
  validate(context: ValidatorContext): ValidationMessage[] {
    const messages: ValidationMessage[] = [];
    const { rootDir } = context;

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
      const filePath = path.join(rootDir, file);
      if (!fs.existsSync(filePath)) {
        messages.push({
          level: 'error',
          location: file,
          message: `Required file is missing: ${file}`,
        });
      }
    }

    return messages;
  },
};
