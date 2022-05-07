import type { JSONObject } from '@sveltejs/kit/types/private';
import yaml from 'js-yaml';
import { readdirSync, readFileSync, existsSync, writeFileSync, unlinkSync, renameSync } from 'fs';
import md from './markdown';

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

	/**
	 *
	 * @param title title to convert to slug
	 * @returns slug of title by removing any trailing spaces and change space within to '-'
	 */
	static slug(title: string): string {
		return title.toLowerCase().trim().replace(/ /g, '-').replace(/[.\\/:*?"<>|]/g, '');
	}

	/**
	 * Add a new blog to path,
	 * @param blog blog data
	 * @returns true if sucess else false
	 */
	add(blog: BlogContent): boolean {
		const slug = BlogManager.slug(blog.title);
		const path = `${this.path}/${slug}.yaml`;

		if (!existsSync(path)) {
			const date = new Date().toISOString();
			const data = blog as Blog;

			data.htmlContent = md(blog.content);
			data.slug = slug;
			data.createdAt = date;
			data.updatedAt = date;

			writeFileSync(path, yaml.dump(data));
			return true;
		}

		return false;
	}

	/**
	 *
	 * @param slug slug of blog to delete
	 * @returns return fasle if slug not founded else true
	 */
	delete(slug: string): boolean {
		const path = `${this.path}/${slug}.yaml`;

		if (existsSync(path)) {
			unlinkSync(path);
			return true;
		}
		return false;
	}

	/**
	 *
	 * @param slug slug of blog to edit
	 * @param newContent new information to overwrite
	 * @returns return false if slug not found else true
	 */
	edit(slug: string, newContent: BlogContent): boolean {
		const path = `${this.path}/${slug}.yaml`;
		if (!existsSync(path)) return false;

		const blog = yaml.load(readFileSync(path, 'utf-8')) as Blog;
		blog.updatedAt = new Date().toISOString();

		blog.title = newContent.title;
		blog.description = newContent.description;
		blog.content = newContent.content;
		blog.htmlContent = md(newContent.content);

		if (blog.slug != BlogManager.slug(newContent.title)) {
			// rename file
			blog.slug = BlogManager.slug(newContent.title);
			const newPath = `${this.path}/${blog.slug}.yaml`;
			renameSync(path, newPath);
			writeFileSync(newPath, yaml.dump(blog));
		} else writeFileSync(path, yaml.dump(blog));

		return true;
	}

	/**
	 * Get specific blog
	 * @param slug slug of needed blog
	 * @returns information of that blog
	 */
	get(slug: string): Blog {
		const path = `${this.path}/${slug}.yaml`;
		if (!existsSync(path)) throw `Can't find blog with this slug ${slug}`;
		return yaml.load(readFileSync(path, 'utf-8')) as Blog;
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
