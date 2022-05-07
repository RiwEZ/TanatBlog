<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Blog, BlogContent } from '$lib/blog';

	export const load: Load = async ({ fetch, params }) => {
		const resp = await fetch(`/api/post?slug=${params.slug}`);
		const post = (await resp.json()) as Blog;

		return { props: { post } };
	};
</script>

<script lang="ts">
	import Blogcard from '$lib/components/blogcard.svelte';
	import { goto } from '$app/navigation';

	export let post: Blog;

	const slug = post.slug;

	const handleSave = async (event: any) => {
		const blogpost = event.detail.blogpost as BlogContent;
		const res = await fetch('/api/post', {
			method: 'PATCH',
			body: JSON.stringify({ slug: slug, newContent: blogpost })
		});

		if (res.status === 200) {
			if (slug !== event.detail.slug) goto(`/blog/edit/${event.detail.slug}`);
		}
	};
</script>

<Blogcard {...post} on:save={handleSave} />
