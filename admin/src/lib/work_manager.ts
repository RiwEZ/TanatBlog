import { load, dump } from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';
import type { JSONObject } from '@sveltejs/kit/types/private';

export interface Link extends JSONObject {
  href: string;
  text: string;
}

export interface WorkContent extends JSONObject {
  title: string;
  tags: string[];
  links: Link[];
  body: string;
}

export interface Work extends WorkContent {
  id: number;
}

export default class WorkManager {
  path: string;
  works: Work[];
  id: number;

  /**
   * Construct an WorkManager object with a path to works.yaml to store all works.
   * @param path directory location
   */
  constructor(path: string) {
    this.path = path;
    this.works = [];
    this.updateWorks();
    this.id = this.works.length !== 0 ? this.works[this.works.length - 1].id + 1 : 0;
  }

  /**
   * Update this.works with works.yaml path content.
   */
  updateWorks(): void {
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
    this.works = works;
  }

  /**
   * Write this.works to path.
   */
  writeFile(): void {
    writeFileSync(this.path, dump(this.works));
  }

  /**
   * Getting list of works from works.yaml path.
   * @returns list of works
   */
  getAll(): Work[] {
    return this.works;
  }

  /**
   * Add work to works list.
   * If work with the same data is already existed, just push the copy of it.
   * @param work data to add
   * @returns id of added work
   */
  add(work: WorkContent): number {
    const newWork: Work = {
      id: this.id,
      ...work
    };
    this.id++;
    this.works.push(newWork);
    this.writeFile();

    return this.id - 1;
  }

  /**
   * Delete work with given id from works.yaml path.
   * @param id id of work that need to be delete.
   */
  delete(id: number): void {
    this.works = this.works.filter((val) => val.id !== id);
    this.writeFile();
  }

  /**
   * Edit work with given id using newContent.
   * @param id id of work that need to be edit.
   * @param newContent new content to replace old content.
   * @returns false if work not found else true
   */
  edit(id: number, newContent: WorkContent): boolean {
    const idx = this.works.findIndex((val) => val.id === id);
    if (idx === -1) return false;

    this.works[idx] = {
      id: this.works[idx].id,
      ...newContent
    };
    this.writeFile();
    return true;
  }
}
