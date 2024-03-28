import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	}),
});

export const collections = { blog };
