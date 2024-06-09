import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		updatedAt: z.coerce.date(),
	}),
});

const works = defineCollection({
  type: 'data',
  schema: z.object({
    start: z.optional(z.coerce.date()),
    end: z.coerce.date(),
    title: z.string(),
    tags: z.array(z.string()),
    body: z.string(),
    links: z.optional(z.array(z.object({
      href: z.string(),
      text: z.string(),
    }))),
  }),
})

export const collections = { blog, works };
