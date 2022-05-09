import type { RequestHandler } from '@sveltejs/kit';
import WorkManager, { type Work } from '$lib/work_manager';

const wm = new WorkManager('../src/data/works.yaml');

export const get: RequestHandler = async () => {
	const works: Work[] = wm.getAll();
	return { body: works };
};
