<script lang="ts">
  import Content from "./blog/content.svelte";
  import { md } from "$lib/markdown";
  import { live_content } from "$lib/live_content";
</script>


<div class="mt-5">
  <div class="w-full h-full">
    <textarea class="textlive_contentw-full h-56 p-2" bind:value={$live_content}/>
  </div>   
  <div class="w-full -mt-3 h-full">
    <Content content={md($live_content)}/>
  </div>
</div>live_contentlive_content