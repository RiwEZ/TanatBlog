import type { RequestHandler } from '@sveltejs/kit';
import WorkManager, { type Work, type WorkContent } from '$lib/work_manager';

const wm = new WorkManager('../src/data/works.yaml');

export const get: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('id');
  if (query != null) {
    const id = parseInt(query);
    return !isNaN(id) ? { body: wm.getAll().find((val) => val.id === id) } : { status: 404 };
  }

  const works: Work[] = wm.getAll();
  return { body: works };
};

export const post: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as WorkContent;
  const id = wm.add(data);
  return { body: id };
};

export const del: RequestHandler = async ({ request }) => {
  const id = (await request.json()) as number;
  wm.delete(id);
  return { body: id };
};

export const patch: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as { id: number; content: WorkContent };

  console.log(data);

  if (wm.edit(data.id, data.content)) return { body: data.content };
  return { status: 404 };
};
