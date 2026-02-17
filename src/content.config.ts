import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    excerpt: z.string(),
  }),
});

const puppies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puppies' }),
  schema: z.object({
    name: z.string(),
    date: z.coerce.date(),
    status: z.enum(['available', 'reserved', 'sold']),
    sex: z.enum(['male', 'female']),
    color: z.string(),
    image: z.string(),
    gallery: z.array(z.string()).default([]),
    birthDate: z.coerce.date(),
  }),
});

export const collections = { blog, puppies };
