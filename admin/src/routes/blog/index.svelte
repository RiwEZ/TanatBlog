<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Blog } from '$lib/blog';

	export const load: Load = async ({ fetch }) => {
		const resp = await fetch('/api/post');
		const posts = (await resp.json()) as Blog[];
		return { props: { posts } };
	};
</script>

<script lang="ts">
	import Button, { Label, Group, Icon } from '@smui/button';
	import DataTable, { Head, Body, Row, Cell, SortValue } from '@smui/data-table';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import IconButton from '@smui/icon-button';
	import { goto } from '$app/navigation';

	export let posts: Blog[];

	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	let open = false;
	let selectedSlug = '';

	const handleSort = () => {
		posts.sort((a, b) => {
			if (sortDirection === 'ascending') return a.createdAt >= b.createdAt ? -1 : 1;
			else return a.createdAt >= b.createdAt ? 1 : -1;
		});
		posts = posts;
	};

	const refetch = async () => {
		const resp = await fetch('/api/post');
		posts = (await resp.json()) as Blog[];
	};

	const delBlog = async (slug: string) => {
		const resp = await fetch('/api/post', { method: 'DELETE', body: JSON.stringify(slug) });
		if (resp.status === 200) {
			refetch();
		}
	};
</script>

<Dialog bind:open aria-labelledby="title" aria-describedby="content">
	<Title id="title">Confirm?</Title>
	<Content>Are you sure you want to delete this blog?</Content>
	<Actions>
		<Button>No</Button>
		<Button on:click={() => delBlog(selectedSlug)}>Yes</Button>
	</Actions>
</Dialog>

<div class="mx-10 w-full max-w-6xl">
	<div class="flex w-full justify-between">
		<h1 class="text-2xl font-bold">Blog</h1>
		<Button class="my-auto" variant="raised" href="/blog/create">
			<Icon class="material-icons">add</Icon>
			<Label>Create new entry</Label>
		</Button>
	</div>

	<DataTable class="mt-5 w-full" sortable bind:sortDirection on:SMUIDataTable:sorted={handleSort}>
		<Head>
			<Row>
				<Cell>
					<Label>CREATED DATE</Label>
					<IconButton class="material-icons">arrow_upward</IconButton>
				</Cell>
				<Cell sortable={false}>TITLE</Cell>
				<Cell sortable={false}>DESCRIPTION</Cell>
				<Cell sortable={false}>SLUG</Cell>
				<Cell sortable={false} />
			</Row>
		</Head>
		<Body>
			{#each posts as post}
				<Row>
					<Cell>{new Date(post.createdAt).toLocaleDateString('en-gb')}</Cell>
					<Cell>{post.title}</Cell>
					<Cell>{post.description}</Cell>
					<Cell>{post.slug}</Cell>
					<Cell>
						<Group variant="outlined">
							<Button class="material-icons" on:click={() => goto(`/blog/edit/${post.slug}`)}
								>edit</Button
							>
							<Button
								class="material-icons"
								on:click={() => {
									open = !open;
									selectedSlug = post.slug;
								}}>delete</Button
							>
						</Group>
					</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</div>
