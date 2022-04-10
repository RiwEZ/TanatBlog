import type { RequestHandler } from "@sveltejs/kit";
import type { Blog } from "$lib/type";
import { PATH } from "./posts";
import { writeFileSync, existsSync, unlinkSync } from "fs";
import yaml from "js-yaml";

export const post: RequestHandler = async ({ request, url }) => {
  const body = await request.json();
  const data = body as Blog;
  const blog_path = `${PATH}/${data.slug}.yaml`;

  // with query
  if (url.searchParams.get("slug")) {
    writeFileSync(blog_path, yaml.dump(data));
    return {};
  }

  // with out query
  let success = false;
  if (!existsSync(blog_path)) {
    writeFileSync(blog_path, yaml.dump(data));
    success = true;
  }

  return { body: success };
};

export const del: RequestHandler = async ({ url }) => {
  const slug = url.searchParams.get("slug");
  const blog_path = `${PATH}/${slug}.yaml`;

  if (existsSync(blog_path)) unlinkSync(blog_path);

  return {};
};
