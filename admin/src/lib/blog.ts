import type { JSONObject } from '@sveltejs/kit/types/private';
import yaml from 'js-yaml';
import { readdirSync, readFileSync, existsSync, writeFileSync, unlinkSync, renameSync } from 'fs';

export interface BlogContent extends JSONObject {
	title: string;
	description: string;
	content: string;
}

export interface Blog extends BlogContent {
	htmlContent: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

export default class BlogManager {
	path: string;

	/**
	 * Construct an BlogManger object with a path to directory to store all blogs.
	 * @param path directory location
	 */
	constructor(path: string) {
		this.path = path;
	}

	slug(title: string): string {
		return title.toLowerCase().trim().replace(/ /g, '-').replace(/[.]/g, '');
	}

	/**
	 * Add a new blog to path,
	 * @param blog blog data
	 * @returns true if sucess else false
	 */
	add(blog: BlogContent): boolean {
		const slug = this.slug(blog.title);
		const path = `${this.path}/${slug}.yaml`;

		if (!existsSync(path)) {
			const date = new Date().toISOString();
			const data = blog as Blog;

			data.htmlContent = blog.content; // TODO
			data.slug = slug;
			data.createdAt = date;
			data.updatedAt = date;

			writeFileSync(path, yaml.dump(data));
			return true;
		}

		return false;
	}

	delete(slug: string): boolean {
		const path = `${this.path}/${slug}.yaml`;

		if (existsSync(path)) {
			unlinkSync(path);
			return true;
		}
		return false;
	}

	edit(slug: string, newContent: BlogContent): boolean {
		const path = `${this.path}/${slug}.yaml`;
		if (!existsSync(path)) return false;

		const blog = yaml.load(readFileSync(path, 'utf-8')) as Blog;
		blog.updatedAt = new Date().toISOString();

		blog.title = newContent.title;
		blog.description = newContent.description;
		blog.content = newContent.content;
		blog.htmlContent = newContent.content; // TODO

		if (blog.slug != this.slug(newContent.title)) {
			// rename file
			blog.slug = this.slug(newContent.title);
			const newPath = `${this.path}/${blog.slug}.yaml`;
			renameSync(path, newPath);
			writeFileSync(newPath, yaml.dump(blog));
		} else writeFileSync(path, yaml.dump(blog));

		return true;
	}

	/**
	 * Get all blogs in path,
	 * @returns all blogs in path
	 */
	getAll(): Blog[] {
		const result: Blog[] = [];
		const files = readdirSync(this.path);
		for (const f of files) {
			if (f.split('.')[1] === 'yaml') {
				const doc = yaml.load(readFileSync(`${this.path}/${f}`, 'utf-8')) as Blog;
				result.push(doc);
			}
		}

		return result;
	}
}
