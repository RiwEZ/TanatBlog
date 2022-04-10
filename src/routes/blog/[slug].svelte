<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Blog } from "$lib/type";
  import qs from "qs";

  export const load: Load = async ({ params, fetch }) => {
    const { slug } = params;
    const query = qs.stringify({
      slug,
    });

    const fetchURL = `/api/posts?${query}`;
    const res = await fetch(fetchURL);
    const res_data = (await res.json()) as Blog;

    return { props: { post: res_data } };
  };
</script>

<script lang="ts">
  import Toc from "svelte-toc";
  import Content from "./content.svelte";
  import Disqus from "$lib/disqus/disqus.svelte";
  import rt from "reading-time";

  export let post: Blog;

  let reading_time = rt(post.content);

  let url = window.location.href;
  let identifier: string = post.title;
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.description} />
</svelte:head>

<div class="mt-10 md:flex">
  <div class="sm:max-w-3xl 3xl:max-w-7xl">
    <h1 class="text-4xl font-bold leading-tight">{post.title}</h1>
    <p class="mt-1 text-zinc-400">
      {reading_time.minutes} minutes read • Last updated
      <b
        >{new Date(post.updated_at).toLocaleDateString("en-gb", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</b
      >
    </p>
    <Content content={post.content} />

    <div class="mt-10 border-t border-gray-500 pt-2 text-sm font-light">
      <em
        >If you can't login to disqus or can't comment please visit
        <a
          class="text-green-600"
          href="https://help.disqus.com/en/articles/1717155-use-of-cookies"
          target="_blank"
        >
          https://help.disqus.com/en/articles/1717155-use-of-cookies
        </a>
        and enable cookies follow their guide.
      </em>
    </div>
    <div class="mt-2">
      <Disqus title={identifier} {url} {identifier} shortname="tanatblog" />
    </div>
  </div>
  <Toc
    headingSelector="article :where(h1, h2, h3, h4):not(.toc-exclude)"
    breakpoint={1270}
    --toc-active-bg="none"
    --toc-active-color="#0ea5e9"
    --toc-hover-color="#0ea5e9"
    --toc-mobile-btn-color="#94a3b8"
    --toc-mobile-btn-bg="#1e293b"
    --toc-mobile-bg="#1e293b"
  />
</div>

<style>
  :global(aside.toc.desktop) {
    position: fixed;
    top: 4rem;
    left: max(0px, calc(50% - 45rem));
    padding: 0.7rem;
  }

  @media (min-width: 2000px) {
    :global(aside.toc.desktop) {
      position: fixed;
      top: 4rem;
      left: 7.5%;
      padding: 0.7rem;
    }
  }

  :global(aside.toc h2) {
    font-weight: bold;
    margin-bottom: 1rem;
  }

  :global(aside.toc nav) {
    overflow: hidden;
    width: 14rem;
  }

  :global(aside.toc li) {
    font-size: 1rem !important;
    margin-top: 0.3em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(aside.toc.mobile) {
    visibility: hidden;
  }
</style>
