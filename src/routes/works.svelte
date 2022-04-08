<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { WorkCard } from "./api/works";

  export const load: Load = async ({ fetch }) => {
    const res = await fetch("/api/works");
    const res_data = await res.json();
    const data = res_data as WorkCard[];

    console.log(data);

    return { props: { works: data } };
  };
</script>

<script lang="ts">
  import Collapsible from "$lib/collapsible.svelte";
  import { each } from "svelte/internal";

  export let works: WorkCard[];
</script>

<svelte:head>
  <title>Works | Tanat</title>
</svelte:head>

<div class="mt-10">
  <h1 class="text-4xl font-semibold">My Works</h1>
  <div class="mt-6">
    {#each works as work}
      <Collapsible>
        <div slot="header" class="rounded-md bg-black p-4 active:rounded-t-md">
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
        <div slot="body" class="rounded-b-md bg-black p-4 text-lg font-light">
          <div class="mb-2 flex space-x-2">
            {#each work.links as link}
              <a
                href={link.href}
                class="text-blue-400 underline underline-offset-1 hover:text-blue-600"
                >{link.text}</a
              >
            {/each}
          </div>
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