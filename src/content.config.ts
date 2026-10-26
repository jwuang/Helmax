import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { locales } from './lib/i18n';
const schema = z.object({
  translationKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.enum(locales),
  routeSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1).max(120), summary: z.string().min(1).max(300),
  category: z.string().min(1), order: z.number().int().default(0),
  draft: z.boolean().default(true), previewOnly: z.boolean().default(false),
  publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
  seoTitle: z.string().min(1).max(120).optional(), seoDescription: z.string().min(1).max(300).optional(),
  cover: z.string().startsWith('/images/').optional(), coverAlt: z.string().min(1).optional(),
}).refine((data) => !data.cover || !!data.coverAlt, { message: 'cover requires coverAlt' });
export const collections = {
  services: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/services' }), schema }),
  cases: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/cases' }), schema }),
  news: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/news' }), schema }),
};
