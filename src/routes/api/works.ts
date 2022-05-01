import type { RequestHandler } from "@sveltejs/kit";
import type { JSONObject } from "@sveltejs/kit/types/private";
import { readFileSync } from "fs";
import yaml from "js-yaml";

export interface WorkCard extends JSONObject {
  title: string;
  tags: string[];
  links: Record<string, string>[];
  body: string;
}

const path = "./src/_data";
export const get: RequestHandler = async () => {
  let resp: WorkCard[] = [];

  try {
    const doc = yaml.load(readFileSync(path + "/works.yaml", "utf-8"));
    resp = doc as WorkCard[];
  } catch (e) {
    resp = [];
  }

  return { body: resp };
};
