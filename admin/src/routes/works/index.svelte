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
	import { goto } from '$app/navigation';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';

	export let works: Work[];

	let open = false;
	let selectedId = -1;
</script>

<Dialog bind:open aria-labelledby="title" aria-describedby="content">
	<Title id="title">Confirm?</Title>
	<Content>Are you sure you want to delete this work?</Content>
	<Actions>
		<Button>No</Button>
		<Button>Yes</Button>
	</Actions>
</Dialog>

<div class="mx-10 w-full max-w-6xl">
	<div class="flex w-full justify-between">
		<h1 class="text-2xl font-bold">Works</h1>
		<Button class="my-auto" variant="raised" on:click={() => goto('/works/create')}>
			<Icon class="material-icons">add</Icon>
			<Label>Create new entry</Label>
		</Button>
	</div>

	<DataTable class="mt-5 w-full">
		<Head>
			<Row>
				<Cell class="w-1/12">ID</Cell>
				<Cell class="w-8/12">TITLE</Cell>
				<Cell class="w-2/12">TAGS</Cell>
				<Cell class="w-1/12" />
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
							<Button on:click={() => goto(`/works/edit/${work.id}`)} class="material-icons"
								>edit</Button
							>
							<Button
								on:click={() => {
									open = !open;
									selectedId = work.id;
								}}
								class="material-icons">delete</Button
							>
						</Group>
					</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</div>
