import type { RequestHandler } from "@sveltejs/kit";
import BlogManager, { type BlogContent } from "$lib/blog";

const bm = new BlogManager('../src/_data/blogs')

export const post: RequestHandler = async ({ request }) => {
  const data = await request.json() as BlogContent;
  bm.add(data);

  return {body: true};
}

export const get: RequestHandler = async () => {
  return {body: bm.getAll()}
}