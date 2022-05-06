<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { WorkCard } from "./api/works.json";
  import { base } from "$app/paths";

  export const load: Load = async ({ fetch }) => {
    const res = await fetch(`${base}/api/works.json`);
    const res_data = await res.json();
    const data = res_data as WorkCard[];

    return { props: { works: data } };
  };
</script>

<script lang="ts">
  import Collapsible from "$lib/collapsible.svelte";

  export let works: WorkCard[];
</script>

<svelte:head>
  <title>Works | Tanat</title>
</svelte:head>

<div class="mt-10">
  <h1 class="text-4xl font-semibold">My Works</h1>
  <div class="mt-6 flex flex-col space-y-4">
    {#each works as work}
      <Collapsible>
        <div
          slot="header"
          class="flex justify-between rounded-md bg-black p-4 active:rounded-t-md"
        >
          <div>
            <h1 class="text-xl">
              {work.title}
            </h1>
            <div class="mt-2 flex flex-shrink space-x-2">
              {#each work.tags as tag}
                <div
                  class="rounded-sm bg-gray-700 py-1 px-2"
                  class:first-tag={work.tags.indexOf(tag) == 0}
                >
                  {tag}
                </div>
              {/each}
            </div>
          </div>
          <svg
            width="20"
            height="20"
            class="flex-shrink-0"
            viewBox="0 0 52 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="2.12132"
              y1="2"
              x2="26"
              y2="25.8787"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
            />
            <line
              x1="26"
              y1="25.8787"
              x2="49.8787"
              y2="2"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div
          slot="body"
          class="rounded-b-md bg-black p-4 pt-0 text-lg font-light"
        >
          {#if typeof work.links !== "undefined"}
            <div class="mb-2 flex space-x-2">
              {#each work.links as link}
                <a
                  href={link.href}
                  class="text-blue-400 underline underline-offset-1 hover:text-blue-600"
                  >{link.text}</a
                >
              {/each}
            </div>
          {/if}
          <p>
            {work.body}
          </p>
        </div>
      </Collapsible>
    {/each}
  </div>
</div>

<style lang="postcss">
  .first-tag {
    @apply bg-indigo-800;
  }
</style>
