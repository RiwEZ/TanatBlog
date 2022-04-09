<script lang="ts">
  import { md } from "$lib/markdown";
  import Content from "./blog/content.svelte";

  let expand_new = false;
  let preview = false;

  let title = "";
  let content = "";
  let description = "";

  $: md_content = md(content === undefined ? "" : content);
  $: slug = title.toLowerCase().replaceAll(" ", "-").replaceAll(".", "");

  const is_empty = (str: string[]) => {
    let result = false;
    for (const s of str) {
      if (s === undefined || s === "") {
        result = true;
        break;
      }
    }
    return result;
  };

  const clean = () => {
    title = "";
    content = "";
    description = "";
  };

  $: filled = !is_empty([title, description, content]);

  const add_blog = async () => {
    if (!filled || !window.confirm("Confirm?")) return;

    const date = new Date().toISOString();
    const res = await fetch("/api/post-manager", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        content: md_content,
        created_at: date,
        updated_at: date,
        slug,
      }),
    });

    if (res.status === 200) clean();
  };
</script>

<div class="mt-10">
  <button
    class="bg-blue-800 p-2 text-lg"
    class:close={expand_new}
    on:click={() => (expand_new = !expand_new)}
    >{!expand_new ? "New" : "Close"}</button
  >
  <div class="bg-black p-4" hidden={!expand_new}>
    <div class="grid">
      <h4>Title</h4>
      <input type="text" bind:value={title} required /><br />
      <h4>Description</h4>
      <input type="text" bind:value={description} required /><br />
      <div class="mb-2 flex space-x-2">
        <h4>Content</h4>
        <button
          class="bg-blue-800 px-2 text-sm"
          class:close={preview}
          on:click={() => (preview = !preview)}>Preview</button
        >
      </div>
      <textarea
        name="content"
        bind:value={content}
        class="bg-zinc-900"
        required
      />
      <button
        on:click|preventDefault={add_blog}
        class:close={!filled}
        class="mt-4 bg-blue-800 p-2">Submit</button
      >
    </div>
  </div>

  <div class="mt-2 bg-zinc-900" hidden={!preview}>
    <h1 class="text-4xl">{title}</h1>
    <Content content={md_content} />
  </div>
</div>

<style lang="postcss">
  input {
    @apply border-gray-400 bg-zinc-900;
  }

  .close {
    @apply bg-red-800;
  }
</style>
