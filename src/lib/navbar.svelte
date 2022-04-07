<script lang="ts">
  // https://bholmes.dev/blog/building-a-sexy-mobile-ready-navbar-in-any-web-framework/
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  let show_mobile_menu = false;

  const nav_items = [
    { name: "Works", href: base + "/works" },
    { name: "About", href: base + "/about" },
    { name: "Contact", href: base + "/contact" },
  ];

  $: show_mobile_menu = $page.url.href && false;

  const nav_click = () => {
    show_mobile_menu = !show_mobile_menu;
  };
</script>

<nav
  class="flex justify-between font-sans"
  class:dropdown-opened={show_mobile_menu}
>
  <a href="{base}/" class="logo text3d text-5xl font-bold">TANAT</a>

  <div
    class="dropdown-link-container flex text-center text-xl font-light md:mt-4 md:space-x-4"
  >
    {#each nav_items as item}
      <a
        href={item.href}
        class:active={$page.url.pathname === `/${item.name.toLowerCase()}`}
      >
        {item.name}
      </a>
    {/each}
  </div>

  <div class="bars mt-5" on:click={nav_click} aria-hidden="true">
    <svg
      width="30"
      preserveAspectRatio="none"
      viewBox="0 0 80 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1"
        y1="1"
        x2="79"
        y2="1"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
      />
      <line
        x1="1"
        y1="41"
        x2="79"
        y2="41"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
      />
      <line
        x1="1"
        y1="21"
        x2="79"
        y2="21"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  </div>
</nav>

<style>
  .text3d {
    text-shadow: 0.01em 0.03em #4ade80, 0.03em 0.05em #2dd4bf,
      0.05em 0.07em #38bdf8;
  }

  .bars {
    display: none;
  }

  @media (max-width: 768px) {
    .dropdown-link-container {
      /* first, make our dropdown cover the screen */
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      /* fix nav height on mobile safari, where 100vh is a little off */
      height: -webkit-fill-available;

      /* then, arrange our links top to bottom */
      flex-direction: column;
      font-size: 1.7rem;
      /* center links vertically, push to the right horizontally.
         this means our links will line up with the rightward hamburger button */
      justify-content: center;
      align-items: flex-end;

      /* add margins and padding to taste */
      margin: 0;
      padding-left: 7vw;
      padding-right: 7vw;

      background: #18181b;

      /* our initial state */
      opacity: 0; /* fade out */
      transform: translateY(-100%); /* move out of view */
      transition: transform 0.2s, opacity 0.2s; /* transition these smoothly */
    }

    nav.dropdown-opened > .dropdown-link-container {
      opacity: 1; /* fade in */
      transform: translateY(0); /* move into view */
    }

    .dropdown-link-container > a {
      margin-top: 1rem;
    }

    .dropdown-link-container > a.active {
      font-weight: bold;
      text-decoration: underline;
    }

    .logo,
    .bars {
      z-index: 1;
    }

    .bars {
      display: initial;
    }
  }
</style>
