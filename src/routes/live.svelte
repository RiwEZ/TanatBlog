<script lang="ts">
  import Content from "./blog/content.svelte";
  import { md } from "$lib/markdown";
  import { content } from "$lib/live_content";
</script>


<div class="mt-5">
  <div class="w-full h-full">
    <textarea class="text-black w-full h-56 p-2" bind:value={$content}/>
  </div>   
  <div class="w-full -mt-3 h-full">
    <Content content={md($content)}/>
  </div>
</div>