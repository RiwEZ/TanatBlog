<script lang="ts">
  import Content from "./blog/content.svelte";
  import { md } from "$lib/markdown";
  import { live_content } from "$lib/live_content";
</script>

<div class="mt-10">
  <h1 class="text-3xl font-bold mb-4">Markdown Editor</h1>
  <div class="w-full h-full">
    <textarea class="text-black w-full h-56 p-2" bind:value={$live_content}/>
  </div>   
  <h1 class="text-3xl font-bold my-4">PREVIEW</h1>
  <div class="w-full -mt-3 h-full">
    <Content content={md($live_content)}/>
  </div>
</div>