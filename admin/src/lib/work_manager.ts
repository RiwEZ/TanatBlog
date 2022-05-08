import { load, dump } from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';

export interface Links {
	href: string;
	text: string;
}

export interface Work {
	title: string;
	tags: string[];
	links: Links[];
	body: string;
}

export default class WorkManager {
	path: string;

	/**
	 * Construct an WorkManager object with a path to works.yaml to store all works.
	 * @param path directory location
	 */
	constructor(path: string) {
		this.path = path;
	}

	/**
	 * Getting list of works from works.yaml path.
	 * @returns list of works
	 */
	getAll(): Work[] {
		let works: Work[] = [];
		works = load(readFileSync(this.path, 'utf-8')) as Work[];

		if (works.length !== 0) {
			works.forEach((item) => {
				item.title = item.title === null ? '' : item.title;
				item.tags = item.tags === null ? [] : item.tags;
				item.links = item.links === null ? [] : item.links;
				item.body = item.body === null ? '' : item.body;
			});
		}
		return works;
	}
	/**
	 * Add work to works list.
	 * If work with the same data is already existed, just push the copy of it.
	 * @param work data to add
	 */
	add(work: Work): void {
		const works = this.getAll();
		works.push(work);
		writeFileSync(this.path, dump(works));
	}
}
