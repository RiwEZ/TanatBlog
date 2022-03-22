
<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Post } from "$lib/type";
  import 'highlight.js/styles/github.css';

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
  import { onMount } from "svelte/internal";

  export let post: Post;
  let content = md(post.content);

  onMount(() => {
		let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    document.head.append(script);

		script.onload = () => {
      MathJax = {
        tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
        svg: {fontCache: 'global'}
      };
		}; 
	});

</script>

<div class="mt-5">
  <h1 class="text-2xl font-bold">{post.title}</h1>
  <p>last updated at: {post.updated_at}</p>
  <div class="mt-5">
    {@html content}
  </div>
</div>