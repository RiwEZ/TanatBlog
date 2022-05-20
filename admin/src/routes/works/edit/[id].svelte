<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Work, WorkContent } from '$lib/work_manager';

	export const load: Load = async ({ fetch, params }) => {
		const resp = await fetch(`/api/works?id=${params.id}`);
		const work = (await resp.json()) as Work;

		return { props: { work, id: parseInt(params.id) } };
	};
</script>

<script lang="ts">
	import Workcard from '$lib/components/workcard.svelte';
	import Button from '@smui/button';
	import Dialog, { Content, Actions } from '@smui/dialog';

	export let work: Work;
	export let id: number;

	let open = false;

	const handleSave = async (event: any) => {
		const content = event.detail as WorkContent;
		const resp = await fetch('/api/works', {
			method: 'PATCH',
			body: JSON.stringify({ id, content })
		});

		if (resp.status === 200) open = true;
	};
</script>

<Dialog bind:open aria-labelledby="title" aria-describedby="content">
	<Content>Saving success!!</Content>
	<Actions>
		<Button>Okay</Button>
	</Actions>
</Dialog>

<Workcard {...work} on:save={handleSave} />
