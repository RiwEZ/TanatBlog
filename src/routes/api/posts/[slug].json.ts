import type { RequestHandler } from '@sveltejs/kit';
import type { Blog } from '../posts.json';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { PATH } from '../posts.json'

export const get: RequestHandler = async ({ params }) => {
  const data = load(readFileSync(`${PATH}/${params.slug}.yaml`, 'utf-8')) as Blog;
  return { body: data };
};
