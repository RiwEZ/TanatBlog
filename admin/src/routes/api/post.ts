import type { RequestHandler } from '@sveltejs/kit';
import BlogManager, { type BlogContent } from '$lib/blog';

const bm = new BlogManager('../src/_data/blogs');

export const post: RequestHandler = async ({ request }) => {
	const data = (await request.json()) as BlogContent;
	if (bm.add(data)) return { status: 200 };
	return { status: 500 };
};

export const get: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('slug');
	if (query !== null) {
		return { body: bm.get(query) };
	}
	return { body: bm.getAll() };
};

export const del: RequestHandler = async ({ request }) => {
	const slug = (await request.json()) as string;
	if (bm.delete(slug)) return { status: 200 };
	return { status: 404 };
};

export const patch: RequestHandler = async ({ request }) => {
	interface PatchReq {
		slug: string;
		newContent: BlogContent;
	}
	const data = await request.json();
	const { slug, newContent }: PatchReq = data;

	console.log(slug, newContent);

	if (bm.edit(slug, newContent)) return { status: 200 };

	return { status: 500 };
};
