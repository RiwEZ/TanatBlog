<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let email: string;
  let name: string;
  let msg: string;
  let email_isright = true;

  const is_empty = (str: string) => {
    return str === undefined || str === '';
  };

  $: {
    if (is_empty(email)) email_isright = true;
    else email_isright = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  $: validation = email_isright && !is_empty(email) && !is_empty(name) && !is_empty(msg);

  const sendMsg = async () => {
    const resp = await fetch('https://formsubmit.co/ajax/tanat1b@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name,
        message: msg
      })
    });

    const data = await resp.json();
    if (data.success) {
      goto(`${base}/thanks`);
    }
  };
</script>

<svelte:head>
  <title>Contact | Tanat</title>
</svelte:head>

<div class="mt-10 grid">
  <h1>Contact Me</h1>
  <p class="mt-6 text-xl font-light text-gray-200">
    Feel free to contact me, if you have any questions or just want to talk with me.
  </p>
  <div class="mt-3">
    <input type="hidden" name="_subject" value="Blog Email" />
    <label for="name">Name</label><br />
    <input bind:value={name} name="name" type="text" placeholder="Monkey D. Luffy" required /><br />
    <label for="email">Email</label><br />
    <input
      bind:value={email}
      class:danger={!email_isright}
      name="email"
      type="email"
      placeholder="spidey1@somewhere.com"
      required
    /><br />
    <label for="message">Message</label><br />
    <textarea
      bind:value={msg}
      name="message"
      class="h-32"
      placeholder="What do you want to tell me?"
      autocomplete="off"
      required
    /><br />
    <button
      disabled={!validation}
      class="mt-4 w-full rounded-md p-2 outline outline-gray-500 hover:bg-black sm:w-1/6"
      on:click={sendMsg}
    >
      Send
    </button>
  </div>
</div>

<style lang="postcss">
  h1 {
    @apply text-4xl font-semibold;
  }

  label {
    @apply mt-3 inline-block text-lg font-bold;
  }

  input.danger {
    @apply border-red-400;
  }

  button:disabled {
    @apply bg-zinc-900 text-zinc-400;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px rgb(24 24 27) inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    border-bottom: 1.5px solid rgb(99 102 241);
  }

  input,
  textarea {
    @apply w-full border-t-0 border-r-0 border-l-0 border-gray-500;
    background-color: #151719;
    border-bottom-width: 1.5px;
    resize: none;
    color-scheme: dark;
  }

  input:focus,
  textarea:focus {
    @apply border-indigo-500 ring-0;
  }
</style>
