<script lang="ts">
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Textfield from '@smui/textfield';
	import IconButton from '@smui/icon-button';
	import Button, { Label, Icon } from '@smui/button';

	let title: string = '';
	let description: string = '';
	let content: string = '';
	let slug: string = '';

	let createdAt: string = 'now';
	let updatedAt: string = 'now';
</script>

<div class="w-full max-w-5xl px-10">
	<Card padded variant="outlined">
		<div class="flex space-x-4">
			<h3>created: {createdAt}</h3>
			<h3>updated: {updatedAt}</h3>
		</div>

		<div class="flex space-x-4">
			<Textfield bind:value={title} label="title" variant="outlined" required />
			<Textfield
				class="w-1/2"
				bind:value={description}
				label="description"
				variant="outlined"
				required
			/>
		</div>

		<Textfield class="mt-5 w-full" bind:value={content} label="content" textarea required />

		<div class="flex">
			<Textfield class="mt-5" bind:value={slug} label="slug" variant="outlined" required />
			<IconButton class="material-icons ml-3 mb-1 self-end">replay</IconButton>
		</div>

		<Actions class="mt-5">
			<ActionButtons>
				<Button variant="raised">
					<Label>Save</Label>
				</Button>
			</ActionButtons>
		</Actions>
	</Card>
</div>

<style lang="postcss">
	h3 {
		@apply m-0 mb-5 font-normal text-zinc-400;
	}
</style>
