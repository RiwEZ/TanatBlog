<svelte:head>
  <title>Home</title>
</svelte:head>

<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { BlogCard } from "$lib/type";
  import { goto } from "$app/navigation";

  export const load: Load = async ({ fetch }) => {
    const res = await fetch("/posts");
    const res_data = await res.json();

    const data: BlogCard[] = res_data.map((item: any): BlogCard => {
      const time = new Date(item.attributes.updatedAt).toLocaleDateString(
        'en-gb',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      )
      return {
        id: item.id,
        slug: item.attributes.slug,
        title: item.attributes.title,
        description: item.attributes.description,
        updated_at: time
      }
    });
    
    return {props: {posts: data }};
  }
</script>

<script lang="ts">
  import { paginate, PaginationNav } from 'svelte-paginate'
  export let posts: BlogCard[];

  let items = posts;
  let currentPage = 1;
  let pageSize = 10;

  $: paginatedItems = paginate({items, pageSize, currentPage});
</script>


<div class="mt-5">
    <div class="container">
        {#each paginatedItems as post} 
          <div 
            class="py-4 border-b cursor-pointer border-gray-500"
            on:click={() => goto("/blog/" + post.slug)}>
            <h3 class="text-2xl font-bold">{post.title}</h3>
            <p class="text-zinc-400">{post.description}</p>
            <p class="text-zinc-400">{post.updated_at}</p>
          </div>
        {/each}
    </div>

    <div class="pagination mt-3">
      <PaginationNav
        totalItems="{posts.length}"
        pageSize="{pageSize}"
        currentPage="{currentPage}"
        limit="{1}"
        showStepOptions="{true}"
        on:setPage="{(e) => currentPage = e.detail.page}"
      />
    </div>
</div>


<style>
  .pagination :global(.pagination-nav) {
    display: flex;
    justify-content: center;
    border-radius: 3px;
    background-color: #27272a;
    background-color: #18181b;
  }
  
  .pagination :global(.option) {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    color: #a1a1aa;
  }

  .pagination :global(.option.number) {
    transition: 0.2s all ease-out;
  }
  
  .pagination :global(path) {
    fill: #fafafa !important;
  }

  .pagination :global(.option.prev:hover),
  .pagination :global(.option.next:hover) {
    background-color: #3f3f46;
    border-radius: 20%;
  } 

  .pagination :global(.option:hover) {
    cursor: pointer;
  }
  
  .pagination :global(.option.active) {
    color: #fafafa;
  }

</style>