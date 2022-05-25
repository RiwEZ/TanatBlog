<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  export const load: Load = ({ error, status }) => {
    return {
      props: {
        title: `${status}: ${error !== null ? error.message : "unknown"}`,
      },
    };
  };
</script>

<script lang="ts">
  import { page } from "$app/stores";
  export let title: string;
  const article_not_founded =
    title === "500: Cannot read property 'slug' of undefined";
</script>

{#if article_not_founded}
  <h1 class="mt-10 text-center text-2xl">
    Can't find this article <b class="text-red-500">"{$page.params.slug}"</b>
  </h1>
{:else}
  <h1 class="mt-10 text-center text-2xl">{title}</h1>
{/if}
