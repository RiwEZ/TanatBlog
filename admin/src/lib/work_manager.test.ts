import WorkManager, { type Work } from './work_manager';
import { load, dump } from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';

const path = './tests/data/works.yaml';
const wm = new WorkManager(path);

it('Can get all works?', () => {
	const expectedWorks: Work[] = [
		{
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
		{ title: 'aa', tags: [], links: [], body: 'wahh' }
	];

	expect(wm.getAll()).toEqual(expectedWorks);
});

it('Can add new work?', () => {
	const work: Work = {
		title: 'b',
		tags: ['a'],
		links: [],
		body: 'ahhhhh'
	};
	const backup: Work[] = load(readFileSync(path, 'utf-8')) as Work[];

	wm.add(work);
	const works: Work[] = load(readFileSync(path, 'utf-8')) as Work[];
	expect(works).toContainEqual(work);

	// reset with backup
	writeFileSync(path, dump(backup));
});
