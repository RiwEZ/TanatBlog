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
  import Button from '@smui/button';
  import Dialog, { Content, Actions } from '@smui/dialog';

  export let post: Blog;

  const slug = post.slug;
  let open = false;

  const handleSave = async (event: any) => {
    const blogpost = event.detail.blogpost as BlogContent;
    const res = await fetch('/api/post', {
      method: 'PATCH',
      body: JSON.stringify({ slug: slug, newContent: blogpost })
    });

    if (res.status === 200) {
      open = true;
      if (slug !== event.detail.slug) goto(`/blog/edit/${event.detail.slug}`);
    }
  };
</script>

<Dialog bind:open aria-labelledby="title" aria-describedby="content">
  <Content>Saving success!!</Content>
  <Actions>
    <Button>Okay</Button>
  </Actions>
</Dialog>

<Blogcard {...post} on:save={handleSave} />
