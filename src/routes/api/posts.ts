import type { RequestHandlerOutput } from "@sveltejs/kit";
import qs from "qs";

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

export const STRAPI = "https://strapi-1w2i.onrender.com/api";

export const get = async (): Promise<RequestHandlerOutput> => {
  const query = qs.stringify({
    fields: ["title", "description", "updatedAt", "slug", "createdAt"],
    sort: ["createdAt:desc"],
  });

  const res = await fetch(
    `${STRAPI}/posts?${query}`
  );
  const jsonresp = await res.json();
  const data = jsonresp.data;

  return { body: data };
};
