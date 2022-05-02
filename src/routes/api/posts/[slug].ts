import type { RequestHandler } from "@sveltejs/kit";
import type { Blog } from "$lib/type";
import { readFileSync } from "fs";
import yaml from "js-yaml";

export const PATH = "./src/_data/blogs";

export const get: RequestHandler = async ({ params }) => {
  const data = yaml.load(
    readFileSync(`${PATH}/${params.slug}.yaml`, "utf-8")
  ) as Blog;
  return { body: data };
};
