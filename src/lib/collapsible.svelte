<script lang="ts">
  let expand = false;
</script>

<div class="card">
  <div class="card-header" aria-expanded={expand} on:click={() => (expand = !expand)}>
    <slot name="header" />
  </div>
  <div class="card-body" class:shown={expand}>
    <slot name="body" />
  </div>
</div>

<style>
  .card-header {
    cursor: pointer;
    user-select: none;
  }

  .card-body {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.2s ease-out;
  }

  .shown {
    max-height: min(200px, 100vh); /* need to set this responsively */
    transition: max-height 0.2s ease-in;
  }
</style>
