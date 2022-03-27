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
    padding: 1em;
    margin-bottom: 0.6em;
    margin-top: 0.6em;
  }

  div :global(a),
  div :global(a:visited) {
    text-decoration: underline;
    color: #60a5fa;
  }

  div :global(a:hover),
  div :global(a:focus),
  div :global(a:active) {
    color: #2563eb;
  }

  div :global(h1),
  div :global(h2),
  div :global(h3),
  div :global(h4) {
    margin: 1.414rem 0 .5rem;
    font-weight: bold;
    line-height: 1.42;
  }

  div :global(h1) {
    margin-top: 0;
    font-size: 3em;
  }

  div :global(h2) {
    font-size: 2.5em;
  }

  div :global(h3) {
    font-size: 2em;
  }

  div :global(h4) {
    font-size: 1.5em;
  }
  
  div :global(h5) {
    font-size: 1.17em;
  }

  div :global(h6) {
    font-size: .88em;
  }

  div :global(p),
  div :global(li) {
    color: #e4e4e7;
    font-size: 1.15em;
  }

  div :global(ul) {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1rem;
  }

</style>