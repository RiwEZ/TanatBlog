---
title: Changing from Strapi to my owm CMS.
description: How I implement my own CMS and why I do it.
createdAt: '2022-06-03T12:12:26.069Z'
updatedAt: '2022-06-03T12:26:34.917Z'
---
In this blog, I'll tell you how I build my own CMS to manage my contents on this website.
## Why not use Strapi?
First of all, why not just use Strapi? Strapi is a great CMS, but we only manage a few simple contents 
like blog markdown and information on my work. So, using Strapi seems to be overengineering, and I can save 
my money by not hosting Strapi. 
## What do I need in my CMS?
Overall, I want a Strapi-like UI for managing my blogs and works. It should look something like this.
\\
*Overall UI, left side is a navigation tab and right side is a page*
![overall](https://i.imgur.com/zwgOfw5.png) _Create/Edit blog UI._
![create](https://i.imgur.com/dtAOtrc.png) And I don't want to host it, so I'll only use development 
server to run this web and push changes to Github after our contents have been handled.
\\
I'll be using YAML files as a database because we can easily manage YAML files by using this package 
[js-yaml](https://www.npmjs.com/package/js-yaml). Other options might be SQLite or MySQL. 
So we also need a backend code using `js-yaml` package to manage my database.

## How do I build my own CMS?
Before we build anything, let's set up [SvelteKit](https://kit.svelte.dev/) project first.
I run `npm init svelte .` in `admin/` folder and use all options in the image below. 
![svelte options](https://i.imgur.com/OUNjS9f.png)
### Backend 
Next, let's create our backend. I want 2 types of data schema for blog and work.
\\
**Blog Data Schema**
`BlogContent` interface will be our input and `Blog` will be our object to save on our database.
```ts
// admin/src/lib/blog.ts
export interface BlogContent extends JSONObject {
	title: string;
	description: string;
	content: string;
}

export interface Blog extends BlogContent {
	htmlContent: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}
```
\\
**Work Data Schema**
Same with the Blog Data Scheme, `WorkContent` will be our input and `Work` will be our object to save on our database.
```ts
// admin/src/lib/work_manager.ts
export interface Link extends JSONObject {
	href: string;
	text: string;
}

export interface WorkContent extends JSONObject {
	title: string;
	tags: string[];
	links: Link[];
	body: string;
	}

export interface Work extends WorkContent {
	id: number;
}
```
And now we need a backend code to manage these data schemas. First, I'll write some tests for our backend code.
\\
**Backend Testing & Development**
I'll use [Jest](https://jestjs.io/) to test our backend code. First install it via `npm install -D jest ts-jest @types/jest` and in `package.json` add jest configuration for `ts` using `ts-jest` and [ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules) configuration.
```json
// admin/package.json
{
	...,
	"jest": {
		"testEnvironment": "node",
		"transform": {
			".[jt]sx?$": "ts-jest"
		},
		"preset": "ts-jest/presets/default-esm",
		"globals": {
			"ts-jest": {
				"useESM": true
			}
		},
		"moduleNameMapper": {
			"^(.{1,2}/.*).js$": "$1"
		}
	},
	"scripts": {
		...,
		"jest": "node --experimental-vm-modules node_modules/jest/bin/jest.js ./src",
	},
}
```
In our backend, we should be able to add, edit, delete and get from our database and these methods should be in our data structure class `BlogManager` and `WorkManager`. So we need to write a test for these methods.
\\
An example of my test cases.
``` ts
// admin/src/lib/blog.test.ts
const path = './tests/data/blogs';
const bm = new BlogManager(path);

test('Can add new blog?', () => {
	const title = 'test add';
	const blog: BlogContent = {
		title,
		description: 'test blog',
		content: 'Lorem .....'
	};
	const ret = bm.add(blog);
	expect(ret).toEqual(true);
	// file name is a slug of title
	const resultPath = `${path}/test-add.yaml`;
	const result = yaml.load(readFileSync(resultPath, 'utf-8')) as BlogContent;
	expect(result).toBeDefined();
	expect(result.title).toEqual(blog.title);
	expect(result.description).toEqual(blog.description);
	expect(result.content).toEqual(blog.content);
	// remove that blog after done testing
	if (existsSync(resultPath)) unlinkSync(resultPath);
});
```
\\
And let's implement `BlogManager` class that will pass this test case.
``` ts
// admin/src/lib/blog.ts
export default class BlogManager {
	path: string;
	
	constructor(path: string) {
		this.path = path;
	}
	
	static slug(title: string): string {
		return title
		.toLowerCase()
		.trim()
		.replace(/ /g, '-')
		.replace(/[.\\\\/:*?\"<>|]/g, '');
	}

	add(blog: BlogContent): boolean {
		const slug = BlogManager.slug(blog.title);
		const path = `${this.path}/${slug}.yaml`;
		if (!existsSync(path)) {
			const date = new Date().toISOString();
			const data = blog as Blog;
			data.htmlContent = md(blog.content);
			data.slug = slug;
			data.createdAt = date;
			data.updatedAt = date;
			writeFileSync(path, yaml.dump(data));
			return true;
		}
		return false;
	}
}
```
For `WorkManager` and other methods, the development process is the same as above. You can see all the codes on [admin/src/lib](https://github.com/RiwEZ/TanatBlog/tree/main/admin/src/lib).
\\
**API Routes**
Now, I need to create an API that our frontend web can use because we can't use `BlogManager` and `WorkManager` class directly on SvelteKit page. In SvelteKit, we can create our API by using [Standalone endpoints](https://kit.svelte.dev/docs/routing#endpoints-standalone-endpoints)
\\
Therefore, we will use `BlogManager` and `WorkManager` class to create our REST API. Where our endpoints `request` will contain any information necessary for our data structure class.
\\
An example of my endpoints. For full source code, you can visit [admin/src/routes/api](https://github.com/RiwEZ/TanatBlog/tree/main/admin/src/routes/api).
```ts
// admin/src/routes/api/post.ts
const bm = new BlogManager('../src/data/blogs');

export const post: RequestHandler = async ({ request }) => {
	const data = (await request.json()) as BlogContent;
	if (bm.add(data)) return { status: 200 };
		return { status: 500 };
};
...
```

### Frontend
Lastly, let's create our frontend using [SMUI](https://sveltematerialui.com/) and [tailwindcss](https://tailwindcss.com/). 
\\
Setting up SMUI can be done by following this [guide](https://sveltematerialui.com/SVELTEKIT.md) (I wish this could be simpler) and setting up tailwindcss by following this [guide](https://tailwindcss.com/docs/guides/sveltekit) but in `app.css` only add `@tailwind components` and `@tailwind utilities` because `@tailwind base` will override some of SMUI styling.
\\
**Overview**
After all the setup, I need to create all of [SvelteKit Pages](https://kit.svelte.dev/docs/routing#pages) that we will need.

This is a list of svelte files on `admin/src/routes` for all of our pages.
```
PS>> tree /f
│   index.svelte
│   __layout.svelte
│
├───blog
│   │   create.svelte
│   │   index.svelte
│   │
│   └───edit
│           [slug].svelte
│
└───works
    │   create.svelte
    │   index.svelte
    │
    └───edit
            [id].svelte
```

`__layout.svelte` is a file that will contain our layout for every page. (You can read more on [SvelteKit Doc](https://kit.svelte.dev/docs/layouts)). So our navigation between 2 of content types will be here and it'll look like the image below.
![overall](https://i.imgur.com/zwgOfw5.png)
Both `blog` and `works` routes are similar because they need to have these nested routes.
- `index` is a page that will show us a list of our contents and some buttons to manage those contents. It'll look like the right side of a picture in _What I need in my CMS?_ section.
	![data table](https://i.imgur.com/m4qcIlX.png)
- `create` and `edit/[some identifier]` is a page that will show us what information we need to provide to that content type. It'll look like the picture in _What I need in my CMS?_ section too. ![create](https://i.imgur.com/dtAOtrc.png)

**Implementation**
First, `__layout.svelte` is a simple svelte component with a few SMUI components inside it, nothing interesting.
\\
Next, `index.svelte` will contain [SMUI Data Table](https://sveltematerialui.com/demo/data-table/) with data from our API by using [SvelteKit Loading](https://kit.svelte.dev/docs/loading) by below code (blog route example).
```ts
<script lang=\"ts\" context=\"module\">
	import type { Load } from '@sveltejs/kit';
	import type { Blog } from '$lib/blog';

	export const load: Load = async ({ fetch }) => {
		const resp = await fetch('/api/post');
		const posts = (await resp.json()) as Blog[];
		return { props: { posts } };
	};
</script>
```
Last, let's look at how I implement `create.svelte` and `edit/[slug].svelte` of blog route. Both of these pages will contain the same component `Blogcard` that will has properties of `type Blog`. `Blogcard` will provide us with data visualization and input forms. 
\\
So in `create.svelte`, we will have an empty `Blogcard` that we need to fill the forms and we can save those data by fetching our API (below code).
``` ts
<script lang=\"ts\">
	import { goto } from '$app/navigation';
	import type { BlogContent } from '$lib/blog';
	import Blogcard from '$lib/components/blogcard.svelte';

	const handleSave = async (event: any) => {
		const blogpost = event.detail.blogpost as BlogContent;
		const res = await fetch('/api/post', {
			method: 'POST',
			body: JSON.stringify(blogpost)
		});
		if (res.status === 200) {
			goto(`/blog/edit/${event.detail.slug}`);
		}
	};
</script>
<Blogcard on:save={handleSave} />
 ```
Did you see something interesting? On `<Blogcard on:save={handleSave} />`, what is `on:save={handleSave}`?. It's a [Svelte Event Forwarding](https://svelte.dev/tutorial/event-forwarding) mechanism. By using the below code on `Blogcard` component, we can handle `Blogcard` save button behavior on an upper component.
```ts
const dispatch = createEventDispatcher();
const onSave = async () => {
	if (filled) { // check if forms if filled
		const blogpost: BlogContent = {
			title,
			description,
			content
		};
		dispatch('save', { blogpost, slug }); // dispatch event data
	}
};
```
Now, in `edit/[slug].svelte` there is significant only one changes from `create.svelte`. 
\\
We are using square brackets on Svelte component file. This is a SvelteKit dynamic parameters.
> From [SvelteKit Doc](https://kit.svelte.dev/docs/routing#pages)
> Dynamic parameters are encoded using\_`[brackets]`. For example, a blog post might be defined by\_`src/routes/blog/[slug].svelte`. These parameters can be accessed in a\_[`load`](https://kit.svelte.dev/docs/loading#input-params)\_function or via the\_[`page`](https://kit.svelte.dev/docs/modules#$app-stores)\_store.

Now we can use dynamic parameters to fetch our blog content that we want to edit and show it on `Blogcard` by providing its properties with fetched blog content. We can use [Svelte Spread Props](https://svelte.dev/tutorial/spread-props) for more compact code too.
 \\
 _Above paragraph in code._
```ts
<script lang=\"ts\" context=\"module\">
	import type { Load } from '@sveltejs/kit';
	import type { Blog, BlogContent } from '$lib/blog';

	export const load: Load = async ({ fetch, params }) => {
		const resp = await fetch(`/api/post?slug=${params.slug}`);
		const post = (await resp.json()) as Blog;
		return { props: { post } };
	};
</script>

<script lang=\"ts\">
	export let post: Blog;
</script>

<Blogcard {...post} on:save={handleSave} />
 ```
For `works` route the implementation is the same as `blog` route. You can view all source code on [TanatBlog](https://github.com/RiwEZ/TanatBlog) repo.

### Conclusion
Yeyyy! I finished creating my own CMS for my blog. We have learned how to create basic [SvelteKit](https://kit.svelte.dev/) web-app with [SMUI](https://sveltematerialui.com/) and [tailwindcss](https://tailwindcss.com/) and using [Jest](https://jestjs.io/) to test backend too. If you have any question please comment below or [contact me](/TanatBlog/contact), and be sure to check [TanatBlog](https://github.com/RiwEZ/TanatBlog) repo.

> This project was fun, but it took way too many times for me 😅. Hope this blog will help others do similar project faster!!!
