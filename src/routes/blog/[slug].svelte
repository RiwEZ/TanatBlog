<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Blog } from "$lib/type";

  export const load: Load = async ({ params, fetch }) => {
    const { slug } = params;
    
    const res = await fetch(`https://tanat-strapi.herokuapp.com/api/posts?filter[slug][$eq]=${slug}`);
    
    if (res.status == 404) {
      const error = new Error(`The post with slug ${slug} was not found`);
      return { status: 404, error};
    }
    else {
      const res_data = await res.json();
      const d = res_data.data[0];

      // convert data to type Post
      const data: Blog = {
        id: d.id,
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

<div class="mt-10">
  <h1 class="text-5xl font-bold leading-tight">{post.title}</h1>
  <p class="text-zinc-400 mt-2">{post.updated_at}</p>
  <Content content={content} />
</div>