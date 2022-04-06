<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content="{post.description}">
</svelte:head>

<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Blog } from "$lib/type";
  import { STRAPI } from "../posts";
  import qs from "qs";

  export const load: Load = async ({ params, fetch }) => {
    const { slug } = params;
    const query = qs.stringify({
      filters: {
        slug: {
          $eq: slug,
        },
      },
    }) 
    const fetchURL = `${STRAPI}/posts?${query}`

    const res = await fetch(fetchURL);
    if (res.status == 404) {
      const error = new Error(`The post with slug ${slug} was not found`);
      return { status: 404, error};
    }
    else {
      const res_data = await res.json();
      const d = res_data.data[0];

      // convert data to type Post
      const data: Blog = {
        slug: d.slug,
        title: d.attributes.title,
        description: d.attributes.description,
        content: d.attributes.content,
        created_at: d.attributes.createdAt,
        updated_at: new Date(d.attributes.updatedAt).toLocaleDateString(
          'en-gb',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        )
      }
      
      return {props: {post: data, fetchURL: fetchURL }};
    }
  }
</script>

<script lang="ts">
  import Toc from "svelte-toc";
  import Content from "./content.svelte";
  import Disqus from "$lib/disqus.svelte";

  export let post: Blog;
  export let fetchURL: string;

  let url = fetchURL;
  let identifier: string = post.title;
</script>

<div class="mt-10 md:flex">
  <div class="sm:max-w-3xl 3xl:max-w-7xl">
    <h1 class="text-4xl font-bold leading-tight">{post.title}</h1>
    <p class="text-zinc-400 mt-1">{post.updated_at}</p> 
    <Content content={post.content} />

    <div class="mt-10 font-light text-sm pt-2 border-t border-gray-500"><em>If you can't login to disqus or can't comment 
      please visit 
      <a class="text-green-600" href="https://help.disqus.com/en/articles/1717155-use-of-cookies" target="_blank">
        https://help.disqus.com/en/articles/1717155-use-of-cookies
      </a> 
      and enable cookies follow their guide.
      </em>
    </div>
    <div class="mt-2">
      <Disqus title={identifier} url={url} identifier={identifier} shortname="tanatblog" />
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
    padding: .7rem;
  }

  @media (min-width: 2000px) {
    :global(aside.toc.desktop) {   
      position: fixed;
      top: 4rem;
      left: 7.5%;
      padding: .7rem;
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