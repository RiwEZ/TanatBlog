<svelte:head>
  <title>Home</title>
</svelte:head>

<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Post } from "$lib/type";

  export const load: Load = async ({ fetch }) => {
    const res = await fetch("/posts");
    const res_data = await res.json();

    const data: Post[] = res_data.data.map((item: any): Post => {
      return {
        id: item.id,
        title: item.attributes.title,
        description: item.attributes.description,
        content: item.attributes.content,
        created_at: item.attributes.createdAt,
        updated_at: item.attributes.updatedAt
      }
    });

    return {props: {posts: data }};
  }
</script>

<script lang="ts">
  export let posts: Post[];
</script>


<div class="mt-5">
    <h1 class="text-5xl">Tanat Blog</h1>
    <p class="mt-1">3 posts</p>
    
    <div class="container">
        {#each posts as post} 
          <div class="py-4 border-b border-gray-500">
            <h3 class="text-2xl">{post.title}</h3>
            <p class="text-gray-500">{post.description}</p>
            <p class="text-gray-500">last updated: {post.updated_at}</p>
          </div>
        {/each}
    </div>
</div>
