<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Work } from '$lib/work_manager';

	export const load: Load = async ({ fetch }) => {
		const resp = await fetch('/api/works');
		const works = (await resp.json()) as Work[];
		return { props: { works } };
	};
</script>

<script lang="ts">
	import Button, { Label, Group, Icon } from '@smui/button';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

	export let works: Work[];
</script>

<div class="mx-10 w-full max-w-6xl">
	<div class="flex w-full justify-between">
		<h1 class="text-2xl font-bold">Works</h1>
		<Button class="my-auto" variant="raised" href="/blog/create">
			<Icon class="material-icons">add</Icon>
			<Label>Create new entry</Label>
		</Button>
	</div>

	<DataTable class="mt-5 w-full">
		<Head>
			<Row>
				<Cell class="w-1/12">ID</Cell>
				<Cell class='w-8/12'>TITLE</Cell>
				<Cell class='w-2/12'>TAGS</Cell>
				<Cell class="w-1/12"></Cell>
			</Row>
		</Head>
		<Body>
			{#each works as work}
				<Row>
					<Cell>{work.id}</Cell>
					<Cell>{work.title}</Cell>
					<Cell>{work.tags}</Cell>
					<Cell>
						<Group variant="outlined">
							<Button class="material-icons">edit</Button>
							<Button class="material-icons">delete</Button>
						</Group>
					</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</div>
