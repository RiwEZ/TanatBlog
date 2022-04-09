import type { RequestHandler } from "@sveltejs/kit";
import { PATH } from "./posts";
import { writeFileSync, existsSync } from "fs";
import yaml from "js-yaml";

interface Blog {
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  content: string
  slug: string;
}

export const post: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const data = body as Blog;
  const blog_path = `${PATH}/${data.slug}.yaml`;
  let success = false;

  if (!existsSync(blog_path)) {
    writeFileSync(blog_path, yaml.dump(data))
    success = true;
  }

  return {body: success};
};
