import type { JSONObject } from '@sveltejs/kit/types/private';
import yaml from 'js-yaml';
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';

export interface Blog extends JSONObject {
	title: string;
	description: string;
	content: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

export default class BlogManager {
	path: string;

	/**
	 * Construct an Article object.
	 * @param path articles location.
	 */
	constructor(path: string) {
		this.path = path;
	}

	add(blog: Blog): boolean {
		const path = `${this.path}/${blog.slug}.yaml`;

		if (!existsSync(path)) {
			writeFileSync(path, yaml.dump(blog));
			return true;
		}
		return false;
	}

	/**
	 *
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
