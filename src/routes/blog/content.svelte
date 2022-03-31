<script lang="ts">
  export let content: string;
</script>

<div class="mt-5">
  {@html content}
</div>

<style >
  /* from this 
    https://github.com/markdowncss/retro 
    https://github.com/goessner/markdown-it-texmath/blob/master/css/texmath.css
  */

  div :global(katex) {
    color: whitesmoke !important;
    font-size: 1.4em !important;
  }

  div :global(eq) {
    display: inline-block;
  }

  div :global(eqn) {
    display: block;
  }

  div :global(section.eqno) {
    display: flex;
    flex-direction: row;
    align-content: space-between;
    align-items: center;
  }
  
  div :global(section.eqno > eqn) {
    width: 100%;
    margin-left: 3em;
  }

  div :global(section.eqno > span) {
    width: 3em;
    text-align: right;
  }

  div :global(pre) {
    padding: 1em;
    margin-bottom: 0.6em;
    margin-top: 0.6em;
  }

  div :global(code:not(pre > code)) {
    color: #d54e53;
    background-color: #000;
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
  }

  div :global(blockquote) {
    border-left: 3px solid #22c55e;
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
    padding-left: 1rem;
    page-break-inside: avoid;
    background-color: #27272a;
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
    font-size: 1.1em;
  }

  div :global(ul) {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1rem;
  }

  div :global(img) {
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.7rem;
    margin-bottom: 0.7rem;
  }

</style>