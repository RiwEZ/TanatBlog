import type { PageLoad } from './$types';
import type { Blog } from './api/posts.json/+server';
import { base } from '$app/paths';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${base}/api/posts.json`);
  const res_data = (await res.json()) as Blog[];
  return { posts: res_data };
};
