import type { PageLoad } from './$types';
import type { Blog } from '../../api/posts.json/+server';
import { base } from '$app/paths';

export const load: PageLoad = async ({ params, fetch }) => {
  const { slug } = params;

  const fetchURL = `${base}/api/posts/${slug}.json`;
  const res = await fetch(fetchURL);
  const res_data = (await res.json());

  return { post: res_data.data as Blog };
};
