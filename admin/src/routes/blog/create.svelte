<script lang="ts">
	import { goto } from '$app/navigation';
	import type { BlogContent } from '$lib/blog';
	import Blogcard from '$lib/components/blogcard.svelte';

	const handleSave = async (event: any) => {
		const blogpost = event.detail.blogpost as BlogContent;
		const res = await fetch('/api/post', {
			method: 'POST',
			body: JSON.stringify(blogpost)
		});

		if (res.status === 200) {
			goto(`/blog/edit/${event.detail.slug}`);
		}
	};
</script>

<Blogcard on:save={handleSave} />
