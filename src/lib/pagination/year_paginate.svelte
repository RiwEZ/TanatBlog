<script lang="ts">
  // https://github.com/TahaSh/svelte-paginate
  import { createEventDispatcher } from 'svelte/internal';
  import { gen_options } from './paginate';

  export let min_year: number;
  export let max_year: number;
  export let curr_year: number;

  let options: number[];

  $: options = gen_options(min_year, max_year);

  const dispatch = createEventDispatcher();
  const option_clicked = () => {
    dispatch('setPage', { year: curr_year });
  };
</script>

<select
  class="form-select rounded-md border-0 bg-zinc-800 focus:ring-0"
  bind:value={curr_year}
  on:change={() => option_clicked()}
>
  {#each options as option}
    <option value={option}>
      {option}
    </option>
  {/each}
</select>
