<script lang="ts">
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';
	import Content from '$lib/components/content.svelte';
	import md from '$lib/markdown';
	import type { Blog } from '$lib/blog';

	let title = '';
	let description = '';
	let content = '';
	let slug = '';
	$: slug = title.toLowerCase().replace(/ /g, '-').replace(/[.]/g, '');

	let createdAt: string = 'now';
	let updatedAt: string = 'now';

	let preview = false;

	const is_empty = (str: string[]) => {
		let result = false;
		for (const s of str) {
			if (s === undefined || s === '') {
				result = true;
				break;
			}
		}
		return result;
	};
	$: filled = !is_empty([title, description, content]);

	const onSave = async () => {
		if (filled) {
			const date = new Date().toISOString();
			const blogpost: Blog = {
				title,
				description,
				content,
				htmlContent: md(content),
				createdAt: date,
				updatedAt: date,
				slug
			};

			const res = await fetch('/api/post', {
				method: 'POST',
				body: JSON.stringify(blogpost)
			});
		}
	};
</script>

<div class="w-full max-w-4xl px-10">
	<Button class="mb-5" variant="raised" href="/blog">
		<Icon class="material-icons">arrow_back</Icon>
		<Label>BACK</Label>
	</Button>

	<Card padded variant="outlined">
		<div class="flex space-x-4">
			<h3>created: {createdAt}</h3>
			<h3>updated: {updatedAt}</h3>
		</div>

		<div class="flex space-x-4">
			<Textfield class="w-1/2" bind:value={title} label="title" variant="outlined" required />
			<Textfield
				class="w-1/2"
				bind:value={description}
				label="description"
				variant="outlined"
				required
			/>
		</div>

		<Button class="mt-5 w-fit" variant="outlined" on:click={() => (preview = !preview)}
			>Preview Content</Button
		>
		<Textfield class="mt-5 w-full" bind:value={content} label="content" textarea required />

		<Textfield
			class="mt-5 w-1/2"
			bind:value={slug}
			label="slug"
			variant="outlined"
			disabled
			required
		/>

		<Actions class="mt-5">
			<ActionButtons>
				<Button variant="raised" on:click={() => onSave()}>
					<Label>Save</Label>
				</Button>
			</ActionButtons>
		</Actions>
	</Card>
	{#if preview}
		<div id="content" class="mt-5 mb-5 max-w-4xl rounded-md bg-zinc-900 p-5">
			<Content content={md(content)} />
		</div>
	{/if}
</div>

<style lang="postcss">
	h3 {
		@apply m-0 mb-5 font-normal text-zinc-400;
	}

	#content :global(img) {
		max-width: 100%;
		max-height: 100%;
		display: block;
	}

	#content :global(p) {
		margin: 0;
	}
</style>
