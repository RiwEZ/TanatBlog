<svelte:head>
  <title>Home</title>
</svelte:head>

<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { BlogCard } from "$lib/type";
  import { goto } from "$app/navigation";

  export const load: Load = async ({ fetch }) => {
    const res = await fetch("/posts");
    const res_data = await res.json();
    
    const data: BlogCard[] = res_data.map((item: any): BlogCard => {
      const time = new Date(item.attributes.updatedAt).toLocaleDateString(
        'en-gb',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
      return {
        slug: item.attributes.slug,
        title: item.attributes.title,
        description: item.attributes.description,
        updated_at: time,
        created_at: item.attributes.createdAt,
      }
    });
    
    return {props: {posts: data }};
  }
</script>

<script lang="ts">
  import YearPaginate from "$lib/pagination/year_paginate.svelte";
  import { paginate } from "$lib/pagination/paginate";
  
  export let posts: BlogCard[];

  let items = posts;
  let max_year = new Date(posts[0].created_at).getFullYear();
  let min_year = new Date(posts[posts.length - 1].created_at).getFullYear();
  let curr_year = new Date(Date.now()).getFullYear();

  let paginated_posts = paginate(items, curr_year);
  $: paginated_posts = paginate(items, curr_year);
  // change pagination to year
  // min_year -> max_year
</script>


<div class="mt-5">
  <div class="container">
    {#each paginated_posts as post} 
      <div 
        class="py-4 border-b cursor-pointer border-gray-500"
        on:click={() => goto("/blog/" + post.slug)}>
        <h3 class="text-2xl font-bold">{post.title}</h3>
        <p class="text-zinc-400">{post.description}</p>
        <p class="text-zinc-400">{post.updated_at}</p>
      </div>
    {/each}
  </div>

  <div class="mt-5 mr-2 flex justify-end">
    <YearPaginate
      min_year={min_year}
      max_year={max_year}
      curr_year={curr_year}
      on:setPage={(e) => curr_year = e.detail.year}
    />
  </div>
</div>