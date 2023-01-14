import type { PageLoad } from './$types';
import type { WorkCard } from '../api/works.json/+server';
import { base } from '$app/paths';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${base}/api/works.json`);
  const res_data = await res.json();
  const data = res_data as WorkCard[];

  return { works: data };
};
