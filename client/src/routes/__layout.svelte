<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/navbar.svelte";
</script>

<div class="max-w-3xl m-auto p-2 mt-6">
  <Navbar />
  <slot />
</div>
