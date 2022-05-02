import type { RequestHandler } from "@sveltejs/kit";
import type { Blog } from "$lib/type";
import { readdirSync, readFileSync } from "fs";
import yaml from "js-yaml";

/*
import type { JSONObject } from "@sveltejs/kit/types/internal";
interface APIdata extends JSONObject {
  id: number;
  attributes: {
    slug: string;
    title: string;
    description: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
}
const data: APIdata[] = [];
for (let i = 0; i < 100; i++) { 
  const time = new Date(2022 + (i/5), 6);
  const d: APIdata = {
      id: i,
      attributes: {
        slug: i.toString(),
        title: i.toString(),
        description: "",
        content: "",
        createdAt: time.toISOString(),
        updatedAt: time.toISOString(),
      },
    };
  data.push(d);
}
data.reverse();
*/

export const PATH = "./src/_data/blogs";

export const get: RequestHandler = async () => {
  const data: Blog[] = [];
  const blogs = readdirSync(PATH);

  for (const blog of blogs) {
    const doc = yaml.load(readFileSync(`${PATH}/${blog}`, "utf-8")) as Blog;
    data.push(doc);
  }

  // sort by created_date from recent to old
  data.sort((a, b) =>
    a.created_at > b.created_at ? -1 : a.created_at < b.date ? 1 : 0
  );

  return { body: data };
};
