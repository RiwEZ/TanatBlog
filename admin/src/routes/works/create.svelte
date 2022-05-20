<script lang="ts">
	import { goto } from '$app/navigation';

	import Workcard from '$lib/components/workcard.svelte';
	import type { WorkContent } from '$lib/work_manager';

	const handleSave = async (event: any) => {
		const work = event.detail as WorkContent;

		const resp = await fetch('/api/works', {
			method: 'POST',
			body: JSON.stringify(work)
		});

		const id = await resp.json();

		if (resp.status === 200) goto(`/works/edit/${id}`);
	};
</script>

<Workcard on:save={handleSave} />
