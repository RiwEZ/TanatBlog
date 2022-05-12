<script lang="ts">
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Chip, { Set, TrailingAction, Text } from '@smui/chips';
	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import { createEventDispatcher } from 'svelte';
	import type { WorkContent, Link } from '$lib/work_manager';

	export let title = '';
	export let tags: string[] = [];
	export let links: Link[] = [];
	export let body = '';

	let tag = '';
	let href = '';
	let text = '';

	const addTag = () => {
		tags.push(tag);
		tag = '';
		tags = tags; // update tags
	};

	const removeTag = (tag: any) => {
		tags.filter(val => val !== tag);
		tags = tags;
	}

	const onKeyPress = (e: any) => {
		if (e.charCode === 13) addTag();
	};


	const onAddLink = () => {
		if (href === '' || text === '') return;

		links.push({href, text});
		links = links;
		href = '';
		text = '';
	}

	const is_empty = (list: (string | Array<any>)[]) => {
		let result = false;
		for (const s of list) {
			if (s === undefined || s === '' || s.length === 0) {
				result = true;
				break;
			}
		}
		return result;
	};

	const dispatch = createEventDispatcher();
	const onSave = async () => {
		if (is_empty([title, tags, body])) {
			alert('title, tags and body required!')
			return;
		}
		dispatch('save', {title, tags, links, body} as WorkContent);
	};
</script>

<div class="w-full max-w-4xl px-10">
	<Button class="mb-5" variant="raised" href="/works">
		<Icon class="material-icons">arrow_back</Icon>
		<Label>BACK</Label>
	</Button>

	<Card padded variant="outlined">
		<Textfield class="mt-5" bind:value={title} label="title" variant="outlined" required />
		<div class="mt-5 flex space-x-4">
			<Textfield
				class="w-1/6"
				bind:value={tag}
				label="tag"
				variant="outlined"
				on:keypress={onKeyPress}
			/>
			<Set chips={tags} let:chip input>
				<Chip class="h-10 self-center" {chip}>
					<Text>{chip}</Text>
					<TrailingAction icon$class="material-icons" on:click={() => removeTag(chip)}>cancel</TrailingAction>
				</Chip>
			</Set>
		</div>

		<div class="mt-5 flex space-x-4">
			<Textfield bind:value={href} label="href" variant="outlined" required />
			<Textfield bind:value={text} label="text" variant="outlined" required />
			<Button class="h-10 my-auto" on:click={onAddLink}>
				<Icon class="material-icons">add</Icon>
				<Label>ADD</Label>
			</Button>
		</div>

		<DataTable class="mt-5">
			<Head>
				<Row>
					<Cell class='w-2/3'>href</Cell>
					<Cell>text</Cell>
				</Row>
			</Head>
			<Body>
				{#each links as link}
					<Row>
						<Cell>{link.href}</Cell>
						<Cell>{link.text}</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>

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
