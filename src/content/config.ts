import { defineCollection, z } from 'astro:content';

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    caseSlug: z.string(),
    ogImage: z.string().optional(),
    lang: z.enum(['en', 'es', 'fr', 'pt']),
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
    pageSlug: z.enum(['home', 'resume']),
    lang: z.enum(['en', 'es', 'fr', 'pt']),
    title: z.string(),
    description: z.string(),
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    articleSlug: z.string(),
    ogImage: z.string().optional(),
    lang: z.enum(['en', 'es', 'fr', 'pt']),
    publishDate: z.string(),
    category: z.enum(['ai-marketing', 'strategy', 'industry-trends', 'personal-growth']),
    excerpt: z.string(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    originalUrl: z.string().optional(),
  }),
});

export const collections = {
  cases,
  pages,
  articles,
};
