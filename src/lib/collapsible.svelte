<script lang="ts">
  let expand = false;
</script>

<div class="card">
  <div
    class="card-header"
    aria-expanded={expand}
    on:click={() => (expand = !expand)}
  >
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
    max-height: 20vh;
    transition: max-height 0.1s ease-in;
  }
  
</style>
