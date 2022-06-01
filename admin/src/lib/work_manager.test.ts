import WorkManager, { type Work, type WorkContent } from './work_manager';
import { load, dump } from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';

const path = './tests/data/works.yaml';
const wm = new WorkManager(path);
let backup: Work[] = [];

beforeEach(() => {
  // store backup
  backup = load(readFileSync(path, 'utf-8')) as Work[];
});

afterEach(() => {
  // reset with backup
  writeFileSync(path, dump(backup));
  wm.updateWorks();
});

it('Can get all works?', () => {
  const expectedWorks: Work[] = [
    {
      id: 1,
      title: 'Top 20 teams of Kibo RPC 2021 (Lynx)',
      tags: ['Space', 'Java', 'Robot'],
      links: [
        {
          href: 'https://www.nstda.or.th/spaceeducation/kibo-rpc-2021-20-final-list/',
          text: 'Result'
        },
        {
          href: 'https://github.com/RiwEZ/kibo_lynx',
          text: 'Code'
        }
      ],
      body: 'Write a java program to make Astrobee robot do designated tasks on ISS simulation.'
    },
    { id: 2, title: 'aa', tags: [], links: [], body: 'wahh' }
  ];

  expect(wm.getAll()).toEqual(expectedWorks);
});

it('Can add new work?', () => {
  const work: WorkContent = {
    title: 'b',
    tags: ['a'],
    links: [],
    body: 'ahhhhh'
  };

  expect(wm.add(work)).toBe(3);
  const works = load(readFileSync(path, 'utf-8')) as Work[];
  expect(works).toContainEqual({ id: 3, ...work });
});

it('Can delete work?', () => {
  wm.delete(2);
  const works = load(readFileSync(path, 'utf-8')) as Work[];

  expect(works.length).toBe(1);
  expect(works[0].id).not.toBe(2);
});

it('Can edit work?', () => {
  const newContent: WorkContent = {
    title: 'cc',
    tags: ['oppai', 'engine'],
    links: [{ href: '/desktop', text: 'wdym' }],
    body: 'not much'
  };
  expect(wm.edit(2, newContent)).toBe(true);
  const works = load(readFileSync(path, 'utf-8')) as Work[];
  expect(works).toContainEqual({ id: 2, ...newContent });
});
