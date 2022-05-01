<script lang="ts">
  import type { Blog } from "./type";
  import { onMount } from "svelte";
  import qs from "qs";
  import Content from "../routes/blog/content.svelte";
  import { md } from "./markdown";

  let posts: Blog[] = [];
  let edit: boolean[] = Array(posts.length);
  let preview: boolean[] = Array(posts.length);
  let dirty = false;

  let backup_posts: Blog[] = [];

  export const reload = () => {
    edit.length = posts.length;
    preview.length = posts.length;
    for (let i = 0; i < edit.length; i++) {
      if (edit[i] === undefined) edit[i] = false;
      if (preview[i] === undefined) preview[i] = false;
    }
    fetch_posts();
  };

  $: {
    if (dirty) {
      reload();
      dirty = false;
    }
  }

  const on_edit = (i: number) => {
    if (edit[i] == true) {
      posts[i] = JSON.parse(JSON.stringify(backup_posts[i])); // deep copy;
    }
    edit[i] = !edit[i];
  };

  const edit_post = async (i: number, slug: string) => {
    if (!window.confirm("Delete this post?")) return;
    const query = qs.stringify({
      slug,
    });

    const data = posts[i];
    data.updated_at = new Date(Date.now()).toISOString();

    const res = await fetch(`/api/post-manager?${query}`, {
      method: "POST",
      body: JSON.stringify(posts[i]),
    });

    if (res.status === 200) {
      edit[i] = !edit[i];
      dirty = true;
    }
  };

  const del_post = async (slug: string) => {
    if (!window.confirm("Delete this post?")) return;

    const query = qs.stringify({
      slug,
    });

    const res = await fetch(`/api/post-manager?${query}`, {
      method: "DELETE",
    });

    if (res.status === 200) dirty = true;
  };

  let c = 0;
  const fetch_posts = async () => {
    const res = await fetch(`/api/posts`);
    const res_data = await res.json();
    posts = res_data;
    backup_posts = JSON.parse(JSON.stringify(posts)); // deep copy
  };

  onMount(() => {
    fetch_posts();
  });
</script>

<div>
  {#each posts as post, i}
    <div class="mt-6 flex w-full justify-between bg-black p-4">
      <div>
        <h3 class="text-lg font-bold" hidden={edit[i]}>{post.title}</h3>
        <input
          type="text"
          class="text-lg"
          hidden={!edit[i]}
          bind:value={post.title}
          required
        />
        <h3 class="mt-2 font-light">
          Created At: {new Date(post.created_at).toLocaleString()}
        </h3>
        <h3 class="font-light">
          Last Update: {new Date(post.updated_at).toLocaleString()}
        </h3>
      </div>
      <div>
        <button on:click={() => on_edit(i)} class="bg-lime-800 p-1"
          >{!edit[i] ? "EDIT" : "CANCEL"}</button
        >
        <button on:click={() => del_post(post.slug)} class="bg-red-800 p-1"
          >DEL</button
        >
      </div>
    </div>
    <div hidden={!edit[i]}>
      <div class="grid bg-black p-4">
        <h3>Description</h3>
        <input type="text" bind:value={post.description} required />
        <div class="mb-2 mt-4 flex space-x-2">
          <h4>Content</h4>
          <button
            class="bg-blue-800 px-2 text-sm"
            class:close={preview[i]}
            on:click={() => (preview[i] = !preview[i])}>Preview</button
          >
        </div>
        <textarea bind:value={post.content} class="h-24 bg-zinc-900" required />
        <button
          on:click={() => edit_post(i, post.slug)}
          class="mt-4 w-1/3 bg-blue-800 p-1">Confirm Edit</button
        >
      </div>
    </div>
    <div hidden={!preview[i]}>
      <Content content={md(post.content)} />
    </div>
  {/each}
</div>

<style lang="postcss">
  input {
    @apply bg-zinc-900 text-base;
  }

  .close {
    @apply bg-red-800;
  }
</style>
