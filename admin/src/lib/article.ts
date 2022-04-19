import type { JSONObject } from '@sveltejs/kit/types/private';
import yaml from 'js-yaml';
import { readdirSync, readFileSync } from 'fs';

export interface Blog extends JSONObject {
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
	content: string;
	slug: string;
}

export default class Article {
	path: string;
	constructor(path: string) {
		this.path = path;
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
