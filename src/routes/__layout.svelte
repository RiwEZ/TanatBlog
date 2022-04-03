<script lang="ts">
  import "../app.css";
  import 'highlight.js/styles/tomorrow-night-bright.css';
  import Navbar from "$lib/navbar.svelte";
</script>

<div class="sm:max-w-3xl m-auto p-4 md:p-2 mt-6 text-zinc-50">
  <Navbar />
  <slot />
</div>