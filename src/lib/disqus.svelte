<script lang="ts" context="module">
  // https://github.com/disqus/disqus-react
  import { onDestroy, onMount } from "svelte/internal";
  import { insert_script, remove_resources, remove_script } from "$lib/disqus";

  const SCRIPT_ID = "dsq-embeded-src";
  const THREAD_ID = "disqus_thread";
  
  declare global {
    interface Window {
      DISQUS?: any;
      disqus_shortname?: string;
      disqus_config?: any;
    }
  }
  
</script>

<script lang="ts">
  export let title: string;
  export let url: string;
  export let shortname: string;
  export let identifier: string;

  onMount(() => {
    if (typeof window !== "undefined" && window.disqus_shortname && window.disqus_shortname !== shortname)
      clean_instance();
    load_instance();
  })
  
  /*
  beforeUpdate(() => {
  })
  afterUpdate(() => {
    clean_instance();
    load_instance();
  })
  */

  onDestroy(() => {
    if (typeof window !== "undefined")
      clean_instance();
  })

  const dq_config = () => function () {
    this.page.url = url;
    this.page.identifier = identifier;
  }

  const load_instance = () => {
    const doc = window.document;
    if (window && window.DISQUS && doc.getElementById(SCRIPT_ID)) {
      window.DISQUS.reset({
        reload: true,
        config: dq_config(),
      })
    }
    else {
      window.disqus_config = dq_config();
      window.disqus_shortname = shortname;
      insert_script(`https://${shortname}.disqus.com/embed.js`, SCRIPT_ID, doc.body);      
    }
  }

  const clean_instance = () => {
    const doc = window.document;
    remove_script(SCRIPT_ID);

    if (window && window.DISQUS)
      window.DISQUS.reset({});

    try {
      delete window.DISQUS;
    } catch (err) {
      window.DISQUS = undefined;
    }

    const disqus_thread = doc.getElementById(THREAD_ID);
    if (disqus_thread) {
      while (disqus_thread.hasChildNodes()) {
        disqus_thread.removeChild(disqus_thread.firstChild);
      }
    }
    remove_resources();
  }
</script>

<div {title} id={THREAD_ID}/>
