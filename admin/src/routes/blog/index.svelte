<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
</script>

<div class="flex w-full justify-between px-10 pt-2">
	<h1 class="font-smui text-2xl font-bold">Blog</h1>
	<Button variant="raised" href="/blog/create">
		<Icon class="material-icons">add</Icon>
		<Label>Create new entry</Label>
	</Button>
</div>
