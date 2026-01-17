import { defineCollection, z } from 'astro:content';

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['en', 'es']),
    theme: z.enum(['audience', 'benchmark', 'narrative', 'capacity']),
    role: z.string(),
    org: z.string(),
    regions: z.array(z.string()),
    timeframe: z.string(),
    problem: z.string(),
    approach: z.array(z.string()),
    systemDesign: z.array(z.string()),
    dataSources: z.array(z.string()),
    outputs: z.array(z.string()),
    decisionImpact: z.array(z.string()).min(3),
    adoption: z.string(),
    governance: z.string(),
    tools: z.array(z.string()),
    confidentialityNote: z.string().optional(),
    featured: z.boolean().default(false),
    artifacts: z
      .array(
        z.object({
          type: z.enum(['diagram', 'scorecard', 'screenshot', 'template']),
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.enum(['home', 'resume']),
    lang: z.enum(['en', 'es']),
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  cases,
  pages,
};
