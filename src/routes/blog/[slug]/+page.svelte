<script lang="ts">
  import Content from '$lib/content.svelte';
  import rt from 'reading-time';
  import type { PageData } from './$types';

  export let data: PageData;
  let { post } = data;

  let reading_time = rt(post.content);
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.description} />
</svelte:head>

<div class="mt-10">
  <div class="mb-10 sm:max-w-3xl 3xl:max-w-7xl">
    <h1 class="text-4xl font-bold leading-tight">{post.title}</h1>
    <p class="mt-1 text-zinc-400">
      <!-- {reading_time.minutes} minutes read • Last updated -->
      <b
        >{new Date(post.updatedAt).toLocaleDateString('en-gb', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</b
      >
    </p>
    <Content content={post.htmlContent} />
  </div>

  <script
    src="https://utteranc.es/client.js"
    repo="RiwEZ/TanatBlog"
    issue-term="title"
    label="Comment"
    theme="icy-dark"
    crossorigin="anonymous"
    async>
  </script>
</div>
