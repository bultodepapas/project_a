import * as fs from 'fs';
import * as path from 'path';
import type { Validator, ValidatorContext, ValidationMessage } from './core/types';
import {
  isRecord,
  isStringArray,
  validateLocaleRecord,
  validateLocaleArrayRecord,
} from './core/utils';

// Validation rules from original script
const RULES = {
  proofStrip: { maxItems: 5 },
  capabilities: { maxBlocks: 6 },
  experience: { maxBulletsPerRole: 3 },
};

function validateFile(filePath: string): unknown | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export const dataValidator: Validator = {
  name: 'Data Files',
  validate(context: ValidatorContext): ValidationMessage[] {
    const messages: ValidationMessage[] = [];
    const { rootDir } = context;
    const DATA_DIR = path.join(rootDir, 'src', 'data');

    // Check if data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      messages.push({
        level: 'warning',
        location: 'src/data',
        message: 'Data directory does not exist yet. Will be created in Sprint 1.',
      });
      return messages;
    }

    // --- Validate site.json ---
    const sitePath = path.join(DATA_DIR, 'site.json');
    if (fs.existsSync(sitePath)) {
      const site = validateFile(sitePath);
      if (!isRecord(site)) {
        messages.push({
          level: 'error',
          location: 'data/site.json',
          message: 'Invalid JSON in site data file',
        });
      } else {
        if (typeof site.name !== 'string') {
          messages.push({ level: 'error', location: 'data/site.json#name', message: 'Site name must be a string' });
        }
        if (typeof site.email !== 'string') {
          messages.push({ level: 'error', location: 'data/site.json#email', message: 'Site email must be a string' });
        }
        if (typeof site.linkedin !== 'string') {
          messages.push({ level: 'error', location: 'data/site.json#linkedin', message: 'Site linkedin must be a string' });
        }
        validateLocaleRecord(site.jobTitle, 'data/site.json#jobTitle', messages);
        validateLocaleRecord(site.tagline, 'data/site.json#tagline', messages);
        validateLocaleRecord(site.location, 'data/site.json#location', messages);
        validateLocaleRecord(site.pdf, 'data/site.json#pdf', messages);
      }
    }

    // --- Validate home.json ---
    const homePath = path.join(DATA_DIR, 'home.json');
    if (fs.existsSync(homePath)) {
      const home = validateFile(homePath);
      if (!isRecord(home)) {
        messages.push({
          level: 'error',
          location: 'data/home.json',
          message: 'Invalid JSON in home data file',
        });
      } else {
        // Hero
        if (!isRecord(home.hero) || !Array.isArray(home.hero.chips)) {
          messages.push({ level: 'error', location: 'data/home.json#hero.chips', message: 'Hero chips must be an array' });
        } else {
          home.hero.chips.forEach((chip, index) => {
            validateLocaleRecord(chip, `data/home.json#hero.chips.${index}`, messages);
          });
        }

        // HiredFor
        if (!isRecord(home.hiredFor) || !Array.isArray(home.hiredFor.items)) {
          messages.push({ level: 'error', location: 'data/home.json#hiredFor.items', message: 'HiredFor items must be an array' });
        } else {
          home.hiredFor.items.forEach((item, index) => {
            if (isRecord(item)) {
              validateLocaleRecord(item.metricLabel, `data/home.json#hiredFor.items.${index}.metricLabel`, messages);
              if (Array.isArray(item.highlights)) {
                item.highlights.forEach((highlight, hIndex) => {
                  validateLocaleRecord(highlight, `data/home.json#hiredFor.items.${index}.highlights.${hIndex}`, messages);
                });
              }
            }
          });
        }

        // Systems
        if (!isRecord(home.systems) || !Array.isArray(home.systems.cards)) {
          messages.push({ level: 'error', location: 'data/home.json#systems.cards', message: 'Systems cards must be an array' });
        } else {
          home.systems.cards.forEach((card, index) => {
            if (isRecord(card)) {
              validateLocaleRecord(card.title, `data/home.json#systems.cards.${index}.title`, messages);
              validateLocaleRecord(card.description, `data/home.json#systems.cards.${index}.description`, messages);
              if (Array.isArray(card.features)) {
                card.features.forEach((feature, fIndex) => {
                  validateLocaleRecord(feature, `data/home.json#systems.cards.${index}.features.${fIndex}`, messages);
                });
              }
            }
          });
        }

        // Operating Model
        if (!isRecord(home.operatingModel)) {
          messages.push({ level: 'error', location: 'data/home.json#operatingModel', message: 'Operating model must be an object' });
        } else {
          const { nodes, edges } = home.operatingModel as { nodes?: unknown[], edges?: unknown[] };
          if (Array.isArray(nodes)) {
            nodes.forEach((node, index) => {
              if (isRecord(node)) {
                validateLocaleRecord(node.label, `data/home.json#operatingModel.nodes.${index}.label`, messages);
                validateLocaleRecord(node.description, `data/home.json#operatingModel.nodes.${index}.description`, messages);
              }
            });
          }
          if (Array.isArray(edges)) {
            edges.forEach((edge, index) => {
              if (isRecord(edge) && edge.label) {
                validateLocaleRecord(edge.label, `data/home.json#operatingModel.edges.${index}.label`, messages);
              }
            });
          }
        }
      }
    }

    // --- Validate proof.json ---
    const proofPath = path.join(DATA_DIR, 'proof.json');
    if (fs.existsSync(proofPath)) {
      const proof = validateFile(proofPath);
      if (!isRecord(proof)) {
        messages.push({ level: 'error', location: 'data/proof.json', message: 'Invalid JSON in proof data file' });
      } else if (Array.isArray(proof.items)) {
        if (proof.items.length > RULES.proofStrip.maxItems) {
          messages.push({
            level: 'error',
            location: 'data/proof.json',
            message: `Proof strip has ${proof.items.length} items, max is ${RULES.proofStrip.maxItems}`,
          });
        }
        proof.items.forEach((item, index) => {
          if (isRecord(item)) {
            if (!item.href) {
              messages.push({ level: 'error', location: `data/proof.json#${index + 1}`, message: 'Proof item is missing href' });
            }
            if ('title' in item) validateLocaleRecord(item.title, `data/proof.json#${index + 1}.title`, messages);
            if ('detail' in item) validateLocaleRecord(item.detail, `data/proof.json#${index + 1}.detail`, messages);
          }
        });
      }
    }

    // --- Validate skills.json ---
    const skillsPath = path.join(DATA_DIR, 'skills.json');
    if (fs.existsSync(skillsPath)) {
      const skills = validateFile(skillsPath);
      if (!isRecord(skills)) {
        messages.push({ level: 'error', location: 'data/skills.json', message: 'Invalid JSON in skills data file' });
      } else if (Array.isArray(skills.capabilities)) {
        if (skills.capabilities.length > RULES.capabilities.maxBlocks) {
          messages.push({
            level: 'error',
            location: 'data/skills.json',
            message: `Capabilities has ${skills.capabilities.length} items, max is ${RULES.capabilities.maxBlocks}`,
          });
        }
        skills.capabilities.forEach((cap, index) => {
          if (isRecord(cap)) {
            if (!cap.caseLink) {
              messages.push({ level: 'warning', location: `data/skills.json#${index + 1}`, message: 'Capability missing caseLink' });
            }
            validateLocaleRecord(cap.name, `data/skills.json#${index + 1}.name`, messages);
            validateLocaleRecord(cap.evidence, `data/skills.json#${index + 1}.evidence`, messages);
          }
        });
      }
    }

    // --- Validate experience.json ---
    const experiencePath = path.join(DATA_DIR, 'experience.json');
    if (fs.existsSync(experiencePath)) {
      const experience = validateFile(experiencePath);
      if (!isRecord(experience)) {
        messages.push({ level: 'error', location: 'data/experience.json', message: 'Invalid JSON in experience data file' });
      } else if (Array.isArray(experience.roles)) {
        experience.roles.forEach((role, index) => {
          if (isRecord(role)) {
            validateLocaleRecord(role.title, `data/experience.json#${index + 1}.title`, messages);
            validateLocaleArrayRecord(role.bullets, `data/experience.json#${index + 1}.bullets`, messages);
            
            const bullets = role.bullets as { en?: string[], es?: string[] } | undefined;
            const enBullets = bullets?.en || [];
            const esBullets = bullets?.es || [];
            
            if (enBullets.length > RULES.experience.maxBulletsPerRole) {
              messages.push({ level: 'warning', location: `data/experience.json#${index + 1}`, message: `Role has ${enBullets.length} EN bullets, max is ${RULES.experience.maxBulletsPerRole}` });
            }
            if (esBullets.length > RULES.experience.maxBulletsPerRole) {
              messages.push({ level: 'warning', location: `data/experience.json#${index + 1}`, message: `Role has ${esBullets.length} ES bullets, max is ${RULES.experience.maxBulletsPerRole}` });
            }
          }
        });
      }
    }

    // --- Validate education.json ---
    const educationPath = path.join(DATA_DIR, 'education.json');
    if (fs.existsSync(educationPath)) {
      const education = validateFile(educationPath);
      if (!isRecord(education)) {
        messages.push({ level: 'error', location: 'data/education.json', message: 'Invalid JSON in education data file' });
      } else if (Array.isArray(education.items)) {
        education.items.forEach((item, index) => {
          if (isRecord(item)) {
            validateLocaleRecord(item.degree, `data/education.json#${index + 1}.degree`, messages);
            validateLocaleRecord(item.field, `data/education.json#${index + 1}.field`, messages);
            validateLocaleArrayRecord(item.highlights, `data/education.json#${index + 1}.highlights`, messages);
            validateLocaleRecord(item.backContent, `data/education.json#${index + 1}.backContent`, messages);
            if (isRecord(item.achievement)) {
              validateLocaleRecord(item.achievement.label, `data/education.json#${index + 1}.achievement.label`, messages);
            }
          }
        });
      }
    }

    // --- Validate languages.json ---
    const languagesPath = path.join(DATA_DIR, 'languages.json');
    if (fs.existsSync(languagesPath)) {
      const languages = validateFile(languagesPath);
      if (!isRecord(languages)) {
        messages.push({ level: 'error', location: 'data/languages.json', message: 'Invalid JSON in languages data file' });
      } else if (Array.isArray(languages.items)) {
        languages.items.forEach((item, index) => {
          if (isRecord(item)) {
            validateLocaleRecord(item.usedFor, `data/languages.json#${index + 1}.usedFor`, messages);
          }
        });
      }
    }

    // --- Validate awards.json ---
    const awardsPath = path.join(DATA_DIR, 'awards.json');
    if (fs.existsSync(awardsPath)) {
      const awards = validateFile(awardsPath);
      if (!isRecord(awards)) {
        messages.push({ level: 'error', location: 'data/awards.json', message: 'Invalid JSON in awards data file' });
      } else if (Array.isArray(awards.items)) {
        awards.items.forEach((item, index) => {
          if (isRecord(item)) {
            validateLocaleRecord(item.title, `data/awards.json#${index + 1}.title`, messages);
            validateLocaleRecord(item.description, `data/awards.json#${index + 1}.description`, messages);
            validateLocaleArrayRecord(item.highlights, `data/awards.json#${index + 1}.highlights`, messages);
            if (isRecord(item.org)) {
              validateLocaleRecord(item.org, `data/awards.json#${index + 1}.org`, messages);
            }
          }
        });
      }
    }

    return messages;
  },
};
