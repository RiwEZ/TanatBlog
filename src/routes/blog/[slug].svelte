<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Blog } from "../api/posts.json";
  import { base } from "$app/paths";

  export const load: Load = async ({ params, fetch }) => {
    const { slug } = params;

    const fetchURL = `${base}/api/posts/${slug}.json`;
    const res = await fetch(fetchURL);
    const res_data = (await res.json()) as Blog;

    return { props: { post: res_data } };
  };
</script>

<script lang="ts">
  import Content from "$lib/content.svelte";
  import rt from "reading-time";

  export let post: Blog;

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
      {reading_time.minutes} minutes read • Last updated
      <b
        >{new Date(post.updatedAt).toLocaleDateString("en-gb", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</b
      >
    </p>
    <Content content={post.content} />
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
