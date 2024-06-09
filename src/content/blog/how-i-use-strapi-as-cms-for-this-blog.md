---
title: How I use Strapi as CMS for this blog.
description: Using Strapi to create blog posts api endpoints and host it on Heroku or Render
updatedAt: '2022-04-10T11:45:46.229Z'
---

*Note: This blog is heavily inspired by [this blog post from strapi](https://strapi.io/blog/how-to-create-a-blog-with-svelte-kit-strapi)*

<br>

Today, I'll tell you how I manage articles for this blog using [Strapi](https://strapi.io/) and hosting it via [Heroku](https://www.heroku.com/) and [Render](https://render.com/). 

### Prerequisite
- [NodeJs](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed on your machine.
- Some basic JavaScript and [Strapi](https://strapi.io/) knowledge.

### Create Strapi Project
Run this command on an empty folder to create a Strapi project called `cms` and wait for Strapi to create itself.
```bash
npx create-strapi-app cms --quickstart
```
If Strapi hasn't run yet, use this command in `cms` folder.
```bash
npm run develop
```
Now, Strapi should start on [http://localhost:1337/](http://localhost:1337/) and show this signup page.

<img src="https://i.imgur.com/SnHWxRI.png" alt="signup" width=50%> </img>

Continue by signing up and we should get to the Admin page.

#### Creating content types
Find `Content-Type Builder` page and create new collection types `Post` with 
- A `title` field with type `Text`
- A `description` field with type `Text` (`Short text` or `Long text` is up to you)
- A `content` field with `Rich Text` type
- A `slug` field with `UID` type and attached to `title` 

We are using Strapi for our personal blog so no need for any `Relation` between user and article.
![content types](https://i.imgur.com/V809v5X.png)

#### Setting up roles and permissions
First, find `Settings` button on sidebar then click on `Roles` in `USERS & PERMISSIONS PLUGIN` section. Next, select `Public` role and edit permissions of `Post` to only allow `findOne` and `find`.
![permisson](https://i.imgur.com/0ybGQuN.png)

After we finished setting up permissions, try adding some test data on `Content Manger`. Now, we should be able to use [http://localhost:1337/api/post](http://localhost:1337/api/post)  and see the test data we put in.

### Hosting
Strapi has a guide for many hosting platforms for you to select. (see. [Strapi Deployment](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html)).

I have tried hosting on [Heroku](https://dashboard.heroku.com/) and [Render](https://render.com/) and I think both platforms is good to host a Strapi for our blog so I'll tell you how I host my Strapi with both platforms.

#### Hosting on Heroku
Just follow [Strapi Heroku Deployment](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/heroku.html#heroku-install-requirements) and you should have Strapi up on Heroku server.

#### Hosting on Render
You can explore your options in this [article from Render](https://render.com/docs/deploy-strapi). For me, I'm going to use an "Optimize for Cost and Simplicity" option because it's simple, inexpensive and I think I don't need any scaling or zero downtime deploys thing. (*Note that if you want to try the same way with me, you need to at least pay for starter plan.*)
<br>

**Configuration steps.**
1. Create Render Blueprint by creating file `render.yaml`.
	```yaml
	# ./render.yaml
	services:
	  - type: web
	    name: strapi
	    env: node
	    region: singapore # optional
	    plan: starter # need to be at least starter for persistent disk
	    buildCommand: npm install && npm run build
	    startCommand: rsync -a public/ /data/public/ && npm run start
	    healthCheckPath: /_health
	    disk:
	      name: strapi-data
	      mountPath: /data
	      sizeGB: 1
	    envVars:
	      - key: NODE_VERSION
	        value: ~16.13.0
	      - key: NODE_ENV
	        value: production
	      - key: DATABASE_FILENAME
	        value: /data/strapi.db
	      - key: JWT_SECRET
	        generateValue: true
	      - key: ADMIN_JWT_SECRET
	        generateValue: true
	      - key: APP_KEYS
	        generateValue: true
	```
	In build and start command you can use yarn instead of npm, if you want.
2. Add `./config/env/production/server.js` file.
	```js
	// ./config/env/production/server.js
	module.exports = ({ env }) => ({
		url: env("RENDER_EXTERNAL_URL"),
		dirs: {
		public: "/data/public"
		},
	});
	```
3. Edit `./config/database.js` file.
	```js
	// ./config/database.js
	const path = require('path');
	
	module.exports = ({ env }) => ({
	  connection: {
	    client: 'sqlite',
	    connection: {
		    // filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
		    filename: env('DATABASE_FILENAME', path.join(__dirname, '..', '.tmp/data.db')),
	    },
	    useNullAsDefault: true,
	  },
	});

	```
4. Push your changes to GitHub or GitLab and [create an instance of your Blueprint](https://render.com/docs/infrastructure-as-code#getting-started) from the [Render dashboard](https://dashboard.render.com/).

Finally, we should have Strapi up on Render server ready for our blog website.

##### Using pm2 to manage process
Strapi recommends you use [pm2](https://github.com/Unitech/pm2/) to help manage Strapi process. We will be doing this by
1. Install pm2 as a dependency
	```
	npm i pm2
	```
2. Create `server.js` file.
	```js
	// ./server.js
	const strapi = require('@strapi/strapi');
	strapi().start();
	```
3. Create `ecosystem.config.js` by yourself or `pm2 init` (if you have installed pm2 globally)
	```js 
	// ./ecosystem.config.js
	module.exports = {
	  apps: [
	    {
	      name: "app",
	      script: "./server.js",
	      instance: "max",
	      exec_moode: "cluster",
	      env_production: {
	        NODE_ENV: "production",
	      },
	    },
	  ],
	};
	```
	If you wonder what is all these configs please visit [pm2 doc](https://pm2.keymetrics.io/docs/usage/application-declaration/)
4. Edit `package.json` by changing `start` command.
	```json
	"scripts": {
        ...,
        "start": "pm2-runtime start ecosystem.config.js --env production",
        ...
	},
	```

Now, If you commit and push these additions to Heroku or Render, you should see some `PM2 log` in logs.

### Conclusion
Hooray! Now, you have a CMS ready for your personal blog and already online on Heroku/Render Server. If you have any question please comment below or [contact me](/TanatBlog/contact), and be sure to check [Strapi Docs](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html), [pm2 Docs](https://pm2.keymetrics.io/docs/usage/quick-start/), and [source code on Github](https://github.com/RiwEZ/TanatBlogCMS) first.
