import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    prerender: {
      crawl: true,
      // we need to specify all route to blogs here, or else it will not prerendered
      entries: ['*', 
        '/blog/[slug]', 
        '/api/posts/changing-from-strapi-to-my-owm-cms.json', 
        '/api/posts/how-i-use-strapi-as-cms-for-this-blog.json']
    },
    paths: {
      base: process.env.NODE_ENV === 'development' ? '' : '/TanatBlog'
    }
  }
};

export default config;
