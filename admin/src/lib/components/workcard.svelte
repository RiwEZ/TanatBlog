<script lang="ts">
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Chip, { Set, TrailingAction, Text } from '@smui/chips';
	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';
	import { createEventDispatcher } from 'svelte';
	import type { Link } from '$lib/work_manager';

	export let title = '';
	export let tags: string[] = ['Java', 'Space'];
	export let links: Link[] = [];
	export let body = '';

	let tag = '';

	const is_empty = (str: Object[]) => {
		let result = false;
		for (const s of str) {
			if (s === undefined || s === '' || s === []) {
				result = true;
				break;
			}
		}
		return result;
	};
	$: filled = !is_empty([title, tags, links, body]);

	const dispatch = createEventDispatcher();
	const onSave = async () => {
		if (filled) {
			dispatch('save', {});
		}
	};
</script>

<div class="w-full max-w-4xl px-10">
	<Button class="mb-5" variant="raised" href="/works">
		<Icon class="material-icons">arrow_back</Icon>
		<Label>BACK</Label>
	</Button>

	<Card padded variant="outlined">
		<Textfield class="mt-5" bind:value={title} label="title" variant="outlined" required />
		<div class="mt-5 space-x-4 flex">
			<Textfield class="w-1/6" bind:value={tag} label="tag" variant="outlined" />
			<Set chips={tags} let:chip input>
				<Chip class="self-center h-10" {chip}>
					<Text>{chip}</Text>
					<TrailingAction icon$class='material-icons'>cancle</TrailingAction>
				</Chip>
			</Set>
		</div>

		<div class="mt-5 flex space-x-4">
			<Textfield class="" bind:value={tag} label="href" variant="outlined" />
			<Textfield class="" bind:value={tag} label="text" variant="outlined" />
			<Button class="my-auto">
				<Icon class="material-icons">add</Icon>
				<Label>ADD</Label>
			</Button>
		</div>

		<Textfield class="mt-5 w-full" bind:value={body} label="body" textarea required />

		<Actions class="mt-5">
			<ActionButtons>
				<Button variant="raised" on:click={() => onSave()}>
					<Label>Save</Label>
				</Button>
			</ActionButtons>
		</Actions>
	</Card>
</div>
