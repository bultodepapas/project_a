import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { Validator, ValidatorContext, ValidationMessage } from './core/types';

// Validation rules
const RULES = {
  caseStudy: {
    minDecisionImpacts: 3,
    requiredFields: [
      'caseSlug',
      'title',
      'problem',
      'approach',
      'decisionImpact',
      'adoption',
      'governance',
    ],
  },
  article: {
    requiredFields: [
      'title',
      'articleSlug',
      'lang',
      'publishDate',
      'category',
      'excerpt',
      'readTime',
    ],
  },
  page: {
    requiredFields: ['pageSlug', 'lang', 'title', 'description'],
  },
};

function validateDirectory(
  dirPath: string,
  label: string,
  extension: string,
  requiredFields: string[],
  messages: ValidationMessage[]
) {
  if (!fs.existsSync(dirPath)) {
    messages.push({
      level: 'warning',
      location: `src/content/${label}`,
      message: `${label} content directory is missing`,
    });
    return;
  }

  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(extension));
  if (files.length === 0) {
    messages.push({
      level: 'warning',
      location: `src/content/${label}`,
      message: `No ${label} content files found`,
    });
    return;
  }

  files.forEach((fileName) => {
    const fullPath = path.join(dirPath, fileName);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;

    requiredFields.forEach((field) => {
      if (!(field in data)) {
        messages.push({
          level: 'error',
          location: `content/${label}/${fileName}`,
          message: `Missing required field: ${field}`,
        });
      }
    });
  });
}

export const mdxValidator: Validator = {
  name: 'MDX Content',
  validate(context: ValidatorContext): ValidationMessage[] {
    const messages: ValidationMessage[] = [];
    const { rootDir } = context;
    const CONTENT_DIR = path.join(rootDir, 'src', 'content');
    const CASES_DIR = path.join(CONTENT_DIR, 'cases');
    const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');
    const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

    // --- Validate Cases ---
    if (!fs.existsSync(CASES_DIR)) {
      messages.push({
        level: 'warning',
        location: 'src/content/cases',
        message: 'Cases content directory is missing',
      });
    } else {
      const caseFiles = fs.readdirSync(CASES_DIR).filter((file) => file.endsWith('.mdx'));
      if (caseFiles.length === 0) {
        messages.push({
          level: 'warning',
          location: 'src/content/cases',
          message: 'No case study MDX files found',
        });
      } else {
        caseFiles.forEach((fileName) => {
          const fullPath = path.join(CASES_DIR, fileName);
          const raw = fs.readFileSync(fullPath, 'utf-8');
          const parsed = matter(raw);
          const data = parsed.data as Record<string, unknown>;

          RULES.caseStudy.requiredFields.forEach((field) => {
            if (!(field in data)) {
              messages.push({
                level: 'error',
                location: `content/cases/${fileName}`,
                message: `Case missing required field: ${field}`,
              });
            }
          });

          const decisionImpact = data.decisionImpact as unknown[] | undefined;
          if (
            Array.isArray(decisionImpact) &&
            decisionImpact.length < RULES.caseStudy.minDecisionImpacts
          ) {
            messages.push({
              level: 'error',
              location: `content/cases/${fileName}`,
              message: `Decision impact has ${decisionImpact.length} items, min is ${RULES.caseStudy.minDecisionImpacts}`,
            });
          }
        });
      }
    }

    // --- Validate Articles ---
    validateDirectory(
      ARTICLES_DIR,
      'articles',
      '.mdx',
      RULES.article.requiredFields,
      messages
    );

    // --- Validate Pages ---
    validateDirectory(PAGES_DIR, 'pages', '.md', RULES.page.requiredFields, messages);

    return messages;
  },
};
