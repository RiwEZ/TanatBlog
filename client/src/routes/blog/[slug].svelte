<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Blog } from "$lib/type";

  export const load: Load = async ({ params, fetch }) => {
    const { slug } = params;

    const res = await fetch("http://localhost:1337/api/posts/" + slug);
    
    if (res.status == 404) {
      const error = new Error("The post with ID ${slugl} was not found");
      return { status: 404, error};
    }
    else {
      const res_data = await res.json();
      const d = res_data.data;
      
      // convert data to type Post
      const data: Blog = {
        id: d.id,
        title: d.attributes.title,
        description: d.attributes.description,
        content: d.attributes.content,
        created_at: d.attributes.createdAt,
        updated_at: d.attributes.updatedAt.slice(0, 10)
      }
      
      return {props: {post: data }};
    }
  }
</script>

<script lang="ts">
  import { md } from "$lib/markdown";
  import Content from "./content.svelte";

  export let post: Blog;
  let content = md(post.content);

</script>

<div class="mt-10 tracking-tight">
  <h1 class="text-5xl">{post.title}</h1>
  <p class="text-zinc-300 mt-2">{post.updated_at}</p>
  <Content content={content} />
</div>

<style>
  div {
    font-family: 'Courier New', Courier, monospace;
  }
</style>