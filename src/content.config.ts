import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    service: z.string(),
    sessions: z.string().optional(),
    art: z.number().default(0),
  }),
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thoughts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    art: z.number().optional(),
  }),
});

// Unpublished drafts: only shown at /drafts/ while `npm run dev` runs (see src/pages/drafts/[...slug].astro).
const drafts = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!README.md'], base: './drafts/thoughts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    art: z.number().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    en: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    order: z.number(),
    art: z.number().default(0),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { portfolio, thoughts, services, drafts };
