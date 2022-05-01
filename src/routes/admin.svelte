<script lang="ts">
  import Newblog from "$lib/newblog.svelte";
  import Listblog from "$lib/listblog.svelte";

  let listblog;
</script>

<div class="mt-10">
  <Newblog on:reload={listblog.reload()} />
  <Listblog bind:this={listblog} />
</div>
