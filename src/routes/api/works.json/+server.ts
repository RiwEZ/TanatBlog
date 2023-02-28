import type { RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

export const prerender = true;

export interface WorkCard {
  id: number;
  title: string;
  tags: string[];
  links: Record<string, string>[];
  body: string;
}

const path = './src/data';
export const GET: RequestHandler = async () => {
  let resp: WorkCard[] = [];

  try {
    const doc = load(readFileSync(path + "/works.yaml", "utf-8"));
    resp = doc as WorkCard[];
  } catch (e) {
    resp = [];
  }

  return new Response(JSON.stringify(resp));
};