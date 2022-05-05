<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Blog } from '$lib/blog';

	export const load: Load = async ({ fetch }) => {
		const response = await fetch('/api/post');
		const posts = await response.json() as Blog[];
		return { props: { posts } };
	};
</script>

<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import DataTable, { Head, Body, Row, Cell, SortValue } from '@smui/data-table';
	import IconButton from '@smui/icon-button';

	export let posts: Blog[];

</script>

<div class="max-w-6xl w-full mx-10">
	<div class="flex w-full justify-between">
		<h1 class="font-smui text-2xl font-bold">Blog</h1>
		<Button class="my-auto" variant="raised" href="/blog/create">
			<Icon class="material-icons">add</Icon>
			<Label>Create new entry</Label>
		</Button>
	</div>

	<DataTable class="mt-5 w-full">
		<Head>
			<Row>
				<Cell>CREATED DATE</Cell>
				<Cell>TITLE</Cell>
				<Cell class="w-fit">DESCRIPTION</Cell>
				<Cell>SLUG</Cell>
			</Row>
		</Head>
		<Body>
			{#each posts as post}
			<Row>
				<Cell>{post.createdAt}</Cell>
				<Cell>{post.title}</Cell>
				<Cell>{post.description}</Cell>
				<Cell>{post.slug}</Cell>
				<Cell>
					<IconButton class="material-icons" size="button">edit</IconButton>
					<IconButton class="material-icons" size="button">delete</IconButton>
				</Cell>
			</Row>
			{/each}
		</Body>
	</DataTable>
</div>
