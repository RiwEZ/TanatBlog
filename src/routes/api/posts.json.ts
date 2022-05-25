import type { RequestHandler } from "@sveltejs/kit";
import { readdirSync, readFileSync } from "fs";
import { load } from "js-yaml";
import type { JSONObject } from "@sveltejs/kit/types/private";

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

export interface Blog extends JSONObject {
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  htmlContent: string;
  slug: string;
}

export const PATH = "./src/data/blogs";

export const get: RequestHandler = async () => {
  const data: Blog[] = [];
  const blogs = readdirSync(PATH);

  for (const blog of blogs) {
    const doc = load(readFileSync(`${PATH}/${blog}`, "utf-8")) as Blog;
    data.push(doc);
  }

  // sort by created_date from recent to old
  data.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0
  );

  return { body: data };
};
