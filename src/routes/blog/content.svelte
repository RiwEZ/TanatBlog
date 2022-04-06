<script lang="ts">
  export let content: string;
</script>

<article class="mt-5">
  {@html content}
</article>

<style >
    /* from this 
    https://github.com/markdowncss/retro 
    https://github.com/goessner/markdown-it-texmath/blob/master/css/texmath.css
  */

  article :global(katex) {
    color: whitesmoke !important;
    font-size: 1.4em !important;
  }

  article :global(eq) {
    display: inline-block;
  }

  article :global(eqn) {
    display: block;
  }

  article :global(section.eqno) {
    display: flex;
    flex-direction: row;
    align-content: space-between;
    align-items: center;
  }
  
  article :global(section.eqno > eqn) {
    width: 100%;
    margin-left: 3em;
  }

  article :global(section.eqno > span) {
    width: 3em;
    text-align: right;
  }

  article :global(pre) {
    padding: 1em;
    margin-bottom: 0.6em;
    margin-top: 0.6em;
    overflow-x: scroll;
  }

  @media (min-width: 640px) {
    article :global(pre) {
      overflow-x: auto;
    }
  }

  article :global(code:not(pre > code)) {
    color: #d54e53;
    background-color: #000;
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
  }

  article :global(blockquote) {
    border-left: 3px solid #22c55e;
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
    padding-left: 1rem;
    page-break-inside: avoid;
    background-color: #27272a;
  }

  article :global(a),
  article :global(a:visited) {
    text-decoration: underline;
    text-underline-offset: 1px;
    color: #60a5fa;
  }

  article :global(a:hover),
  article :global(a:focus),
  article :global(a:active) {
    color: #2563eb;
  }

  article :global(h1),
  article :global(h2),
  article :global(h3),
  article :global(h4) {
    margin: 1.414rem 0 .5rem;
    font-weight: bold;
    line-height: 1.42;
  }

  article :global(h1) {
    margin-top: 0;
    font-size: 2.25rem;
  }

  article :global(h2) {
    font-size: 2rem;
  }

  article :global(h3) {
    font-size: 1.8em;
  }

  article :global(h4) {
    font-size: 1.5rem;
  }
  
  article :global(h5) {
    font-size: 1.17rem;
    margin-top: .8rem;
    margin-bottom: .3rem;
    font-weight: bold;
  }

  article :global(h6) {
    font-size: .88rem;
  }

  article :global(p),
  article :global(li) {
    color: #e4e4e7;
    font-size: 1rem;
  }

  article :global(ul) {
    list-style-type: disc;
    list-style-position: outside;
    margin-left: 1rem;
    margin-bottom: .3rem;
  }

  article :global(ol) {
    list-style-type: decimal;
    list-style-position: outside;
    margin-top: .3rem;
    margin-left: 1.2rem;
    margin-bottom: .3rem;
  }

  article :global(li) {
    margin-top: .2rem;
  }

  article :global(img) {
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.7rem;
    margin-bottom: 0.7rem;
  }
</style>