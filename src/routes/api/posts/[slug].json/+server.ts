import type { RequestHandler } from './$types';
import type { Blog } from '../../posts.json/+server';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

const PATH = './src/data/blogs';
export const GET: RequestHandler = async ({ params }) => {
  const data = load(readFileSync(`${PATH}/${params.slug}.yaml`, 'utf-8')) as Blog;
  return new Response(JSON.stringify({ data }));
};
