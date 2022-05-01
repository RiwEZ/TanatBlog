<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/navbar.svelte";
</script>

<div class="mx-auto mt-6 p-4 text-zinc-50 sm:max-w-3xl lg:p-2 3xl:max-w-7xl">
  <Navbar />
  <slot />
</div>
