<script lang="ts">
	import '../app.css';
	import Drawer, { Content, Header, Title } from '@smui/drawer';
	import List, { Item, Text } from '@smui/list';
</script>

<div class="mx-20 mt-10 flex">
	<Drawer>
		<Header>
			<Title>Content Types</Title>
		</Header>
		<Content>
			<List>
				<Item href="/blog">
					<Text>Blogs</Text>
				</Item>
				<Item href="/works">
					<Text>Works</Text>
				</Item>
			</List>
		</Content>
	</Drawer>
	<slot />
</div>
