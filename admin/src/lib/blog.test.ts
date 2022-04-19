import type { Blog } from './blog';
import BlogManager from './blog';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import yaml from 'js-yaml';

test('Can access upper folder', () => {
	const bm = new BlogManager('../src/_data/blogs');
	const blogs = bm.getAll();
	expect(blogs).toBeDefined();
});

test('Can add new blog', () => {
	const path = './tests/_data/blogs';
	const bm = new BlogManager(path);

	const title = 'test';
	const date = new Date().toISOString();
	const blog: Blog = {
		title,
		description: 'test blog',
		content: 'Lorem .....',
		slug: title,
		createdAt: date,
		updatedAt: date
	};

	const ret = bm.add(blog);
	expect(ret).toEqual(true);

	const resultPath = `${path}/${title}.yaml`;
	const result = yaml.load(readFileSync(resultPath, 'utf-8')) as Blog;

	expect(result).toBeDefined();
	expect(result).toEqual(blog);

	// remove that blog after done testing
	if (existsSync(resultPath)) unlinkSync(resultPath);
});
