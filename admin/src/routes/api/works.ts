import type { RequestHandler } from '@sveltejs/kit';
import WorkManager, { type Work, type WorkContent } from '$lib/work_manager';

const wm = new WorkManager('../src/data/works.yaml');

export const get: RequestHandler = async () => {
	const works: Work[] = wm.getAll();
	return { body: works };
};

export const post: RequestHandler = async ({ request }) => {
	const data = await request.json() as WorkContent
	const id = wm.add(data);
	return {body: id};
}
