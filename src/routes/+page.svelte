<script lang="ts">
  //import YearPaginate from '$lib/pagination/year_paginate.svelte';
  //import { paginate } from '$lib/pagination/paginate';
  import { base } from '$app/paths';
  import type { PageData } from './$types';

  export let data: PageData;
  let { posts } = data;

  /*  
  let max_year =
    posts !== undefined && posts.length > 0 ? new Date(posts[0].createdAt).getFullYear() : 2100;
  let min_year =
    posts !== undefined && posts.length > 0
      ? new Date(posts[posts.length - 1].createdAt).getFullYear()
      : 2000;
  let curr_year = max_year;

  let paginated_posts = paginate(posts, curr_year);
  $: paginated_posts = paginate(posts, curr_year);
  */
</script>

<svelte:head>
  <title>Home | Tanat</title>
  <meta name="description" content="Developer Blog" />
</svelte:head>

<div class="mt-5">
  <div class="container">
    {#each posts as post}
      <a href={`${base}/blog/${post.slug}`}>
        <div class="cursor-pointer border-b border-gray-500 py-4">
          <h3 class="text-2xl font-bold">{post.title}</h3>
          <p class="mt-2 text-zinc-400">
            <strong
              >{new Date(post.updatedAt).toLocaleDateString('en-gb', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</strong
            >
            • {post.description}
          </p>
        </div>
      </a>
    {/each}
  </div>

  <!--
  <div class="mt-5 mr-2 flex justify-end">
    <YearPaginate
      {min_year}
      {max_year}
      {curr_year}
      on:setPage={(e) => (curr_year = e.detail.year)}
    />
  </div>
  -->
</div>
