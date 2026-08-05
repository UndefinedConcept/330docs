import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const content = defineCollection({
  // Load Markdown and MDX files in the `src/content/` directory.
  loader: glob({ base: './src/content', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      pubDate: z.coerce.date(),
      heroImage: z.optional(image()),
      draft: z.optional(z.boolean()), // `_index.md` files AKA directory nodes should have "draft: true"
    }),
});

export const collections = { content };
