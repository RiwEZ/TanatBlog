import type { Blog, BlogContent } from './blog';
import BlogManager from './blog';
import { readFileSync, existsSync, unlinkSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';

const path = './tests/data/blogs';
const bm = new BlogManager(path);

test('Can access upper folder?', () => {
	const bm = new BlogManager('../src/data/blogs');
	const blogs = bm.getAll();
	expect(blogs).toBeDefined();
});

test('BlockManager slug behaviour', () => {
	expect(BlogManager.slug('test add')).toEqual('test-add');
	expect(BlogManager.slug('Testadd ')).toEqual('testadd');
	expect(BlogManager.slug(' Test add ')).toEqual('test-add');
});

test('Can add new blog?', () => {
	const title = 'test add';
	const blog: BlogContent = {
		title,
		description: 'test blog',
		content: 'Lorem .....'
	};

	const ret = bm.add(blog);
	expect(ret).toEqual(true);

	// file name is a slug of title
	const resultPath = `${path}/test-add.yaml`;
	const result = yaml.load(readFileSync(resultPath, 'utf-8')) as BlogContent;

	expect(result).toBeDefined();
	expect(result.title).toEqual(blog.title);
	expect(result.description).toEqual(blog.description);
	expect(result.content).toEqual(blog.content);

	// remove that blog after done testing
	if (existsSync(resultPath)) unlinkSync(resultPath);
});

test('Can delete blog?', () => {
	const blogSlug = 'test-delete';

	// create mock blog
	writeFileSync(`${path}/${blogSlug}.yaml`, '...');

	const ret = bm.delete(blogSlug);
	expect(ret).toEqual(true);

	expect(existsSync(`${blogSlug}.yaml`)).toEqual(false);
});

test('Can edit blog?', () => {
	const slug = 't2';
	const oldUpdate = '2022-04-10T11:45:46.229Z';

	const blog: BlogContent = {
		title: slug,
		description: 'ah',
		content: 'LOREM'
	};

	// edit 'test-edit' blog
	const ret = bm.edit('test-edit', blog);
	expect(ret).toEqual(true);

	const editedBlog = yaml.load(readFileSync(`${path}/${slug}.yaml`, 'utf-8')) as Blog;

	expect(editedBlog.title).toEqual(blog.title);
	expect(editedBlog.description).toEqual(blog.description);
	expect(editedBlog.content).toEqual(blog.content);

	expect(editedBlog.updatedAt > oldUpdate).toEqual(true);

	// reset test-edit
	const backup: Blog = {
		title: 'Test edit',
		description: 'YAAA',
		content: '..',
		htmlContent: '..',
		slug: 'test-edit',
		createdAt: oldUpdate,
		updatedAt: oldUpdate
	};
	unlinkSync(`${path}/${slug}.yaml`);
	writeFileSync(`${path}/test-edit.yaml`, yaml.dump(backup));
});

test('Can get specific blog?', () => {
	const backup: Blog = {
		title: 'Test edit',
		description: 'YAAA',
		content: '..',
		htmlContent: '..',
		slug: 'test-edit',
		createdAt: '2022-04-10T11:45:46.229Z',
		updatedAt: '2022-04-10T11:45:46.229Z'
	};

	expect(bm.get('test-edit')).toEqual(backup);
});

test('Can not get undefined blog.', () => {
	expect(() => bm.get('asdasdsadadad')).toThrow(`Can't find blog with this slug asdasdsadadad`);
});
