<script lang="ts">
	import Drawer, { AppContent, Content, Header, Title } from '@smui/drawer';
	import List, { Item, Text } from '@smui/list';
  import Blog from '$lib/components/blog.svelte';
</script>

<div>
	<Drawer>
		<Header>
			<Title>Content Types</Title>
		</Header>
		<Content>
			<List>
				<Item>
					<Text>Blogs</Text>
				</Item>
				<Item>
					<Text>Works</Text>
				</Item>
			</List>
		</Content>
	</Drawer>

	<AppContent>
		<main class="main-content">
      <Blog></Blog>
    </main>
	</AppContent>
</div>

<style>
	div {
		display: flex;
	}
	.main-content {
		padding: 2rem;
	}
</style>
