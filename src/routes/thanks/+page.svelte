<script lang="ts">
  import { base } from '$app/paths';

  $: console.log(base);
</script>

<div class="mt-10">
  <h1 class="mb-5 text-center text-4xl font-semibold leading-normal">
    Thank you for contacting me! <br />I'll reply to you soon.
  </h1>

  <a href={`/${base}`}>
    <h3 class="text-center text-lg font-bold text-blue-400 underline hover:text-blue-600">
      Get back to the main page.
    </h3></a
  >
</div>
