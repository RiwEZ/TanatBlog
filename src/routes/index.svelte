<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Blog } from "$lib/type";
  import { base } from "$app/paths";

  export const load: Load = async ({ fetch }) => {
    const res = await fetch(`${base}/api/posts`);
    const res_data = (await res.json()) as Blog[];
    return { props: { posts: res_data } };
  };
</script>

<script lang="ts">
  import YearPaginate from "$lib/pagination/year_paginate.svelte";
  import { paginate } from "$lib/pagination/paginate";
  import { goto } from "$app/navigation";

  export let posts: Blog[];

  let items = posts;
  let max_year =
    posts !== undefined && posts.length > 0
      ? new Date(posts[0].created_at).getFullYear()
      : 2100;
  let min_year =
    posts !== undefined && posts.length > 0
      ? new Date(posts[posts.length - 1].created_at).getFullYear()
      : 2000;
  let curr_year = new Date(Date.now()).getFullYear();

  let paginated_posts = paginate(items, curr_year);
  $: paginated_posts = paginate(items, curr_year);
</script>

<svelte:head>
  <title>Home | Tanat</title>
  <meta name="description" content="Developer Blog" />
</svelte:head>

<div class="mt-5">
  <div class="container">
    {#each paginated_posts as post}
      <a href={`${base}/blog/${post.slug}`}>
        <div class="cursor-pointer border-b border-gray-500 py-4">
          <h3 class="text-2xl font-bold">{post.title}</h3>
          <p class="mt-2 text-zinc-400">
            <strong
              >{new Date(post.updated_at).toLocaleDateString("en-gb", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</strong
            >
            • {post.description}
          </p>
        </div>
      </a>
    {/each}
  </div>

  <div class="mt-5 mr-2 flex justify-end">
    <YearPaginate
      {min_year}
      {max_year}
      {curr_year}
      on:setPage={(e) => (curr_year = e.detail.year)}
    />
  </div>
</div>
