
<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Post } from "$lib/type";

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
      const data: Post = {
        id: d.id,
        title: d.attributes.title,
        description: d.attributes.description,
        content: d.attributes.content,
        created_at: d.attributes.createdAt,
        updated_at: d.attributes.updatedAt
      }
      
      return {props: {post: data }};
    }
  }
</script>

<script lang="ts">
  import { md } from "$lib/markdown";
  import Content from "./content.svelte";

  export let post: Post;
  let content = md(post.content);

</script>

<div class="mt-5">
  <h1 class="text-7xl font-bold">{post.title}</h1>
  <p class="text-zinc-200">last updated at: {post.updated_at}</p>
  <Content content={content} />
</div>


