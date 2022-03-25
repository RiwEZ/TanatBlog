<script lang="ts">
  import { onMount } from "svelte/internal";
  export let content;

  // loading MathJax
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
  {@html content}
</div>

<style >
  /* from this https://github.com/markdowncss/retro */
  div :global(mjx-container) {
    color: whitesmoke;
    font-size: 130% !important;
  }

  div :global(pre) {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  div :global(h1),
  div :global(h2),
  div :global(h3),
  div :global(h4) {
    margin: 1.414rem 0 .5rem;
    font-weight: inherit;
    line-height: 1.42;
  }

  div :global(h1) {
    margin-top: 0;
    font-size: 3.998rem;
  }

  div :global(h2) {
    font-size: 2.827rem;
  }

  div :global(h3) {
    font-size: 1.999rem;
  }

  div :global(h4) {
    font-size: 1.414rem;
  }
  
  div :global(h5) {
    font-size: 1.121rem;
  }

  div :global(h6) {
    font-size: .88rem;
  }

  div :global(p) {
    font-size: 1rem;
    margin-bottom: 1.3rem;
  }

  div :global(ul) {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1rem;
  }

</style>