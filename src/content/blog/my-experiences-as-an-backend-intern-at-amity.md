---
title: My Experiences As An Backend Intern at Amity
description: A very brief summary of my intern experience.
slug: my-experiences-as-an-backend-intern-at-amity
updatedAt: '2023-11-12T22:35:02.889Z'
---

Amity is currently referred to 2 companies, Amity Solution and Amity
Technology. I worked on Amity Technology, which sells SDK and UI-Kit that
provide social media features for customers' applications. You can check out
the details of their product at [their
website](https://www.amity.co/social-cloud).

<br>

Basically, we provide building blocks and some finished components for the
customer to implement their own social media on their applications. So they
don't need to build any infrastructure by themselves and can have their own
social media that they can manage themselves (no need to abide by the rules of
big social media like Facebook or Twitter anymore) 

## So how was my work?

My day-to-day work looks like this

1. Team standup:  talked with the team about what have I done yesterday, what
will I do today, do some code review, problem discussion, and normal
conversation.

2. Squad standup: short talk with **Project Manager** about what have I done,
how the progress of each task and is there any blocker needs to be discussed,
sprint planning, and sprint retro.

3. Any other meetings necessary in between 

4. The remaining time is me working on the Jira ticket that I need to do.



And the works I do are mainly

1. Developing a new feature.

2. Fixing any bugs that customers raised or we've found

3. Technical debts work such as dependencies update, improving unit test 

4. Any other miscellaneous tasks e.g. prepare for knowledge sharing session 

### The new technology that I learned

![tech](https://imgur.com/CeBkIAn.png)

I have little experience writing a backend in JS/TS (express 🤣) and I still
don't think it's a good choice to write backend in JS/TS because we don't have
**REAL** types and the performance improvement is kinda hard (it's garbage
collected and memory management is kind of not exist at all right?). 

<br>

Yeah, everything at Amity is written in JS/TS 🤦‍♂️. And I have learned so
many things about JS ecosystem on backend side such as

- [MoleculerJs](https://moleculer.services/index.html) which is a microservice
framework that includes almost anything you want.  Our core system is mainly
implemented on this framework.

- [CRACO](https://craco.js.org/) (ಠ_ಠ),
create-react-app-configuration-override an upgraded version of
create-react-app which is super slow lol.



And there are also other things 

- [MongoDB](https://www.mongodb.com/), our main database. I have learned how
to index the database, design a proper data schema, different types of MongoDB
collections/operations etc.

- [Redis](https://redis.io/), our main cache. I have learned how to use it,
and different types of data structures in it.

- AWS Services e.g. [AWS Eventbridge
scheduler](https://aws.amazon.com/eventbridge/scheduler/), [AWS
Lambda](https://aws.amazon.com/lambda/), [AWS
SQS](https://aws.amazon.com/sqs/)

- [Serverless Framework](https://www.serverless.com/), we can use this to
deploy AWS services programmatically.

- [Kubernetes](https://kubernetes.io/), which our core system is deployed
using it. I only learned about how to use [k9s](https://k9scli.io/) to see
logs and check out each pod.

### Developing a new feature

How is feature developed on Amity?. I'll only talk about it on the backend
engineer side by explaining how I developed *Post Impression* feature (but
only a fraction of it).  

![impression](https://i.imgur.com/tRrEkcj.png)

So first we get the requirements of the feature that we need to do. For *Post
Impression* feature, for example

- Definition: impression is non-unique count of users who have viewed the post

- When user view a post, post impression should increase

- User should be able to view the impression value on post
  <br>

  (note that in reality, the requirements are much more detailed than this)


And then we need to propose a planned solution of how we should implement this
feature on the current system (we called it tech-spec). This spec should
describe what will need to be added, what needs to change, and wheter is there
any new infrastructure. The spec should also be detailed as much as possible
so the lead engineer and system architect can understand it completely and
give a review. 

<br>

For example, we will first draw the overall architecture diagram like the
picture below and then explain what does each part do

- User will need to first send a request to increase the post impression,
then`moleculer service #1` will check for user's quota and send it to the `SQS
#1`.

- `moleculer service #2` will then poll a batch from the `SQS #1`, process the
batch (check user's permission, etc.) and then send it to the next `SQS #2`.

- The lambda will then poll a batch from the `SQS #2`, count the impression
value and insert the unique view activity to a new MongoDB instance for this
feature. Then it will call an internal API to update the impression value on
core system.

- `SQS #1` and `SQS #2` are used to make the load steady on `moleculer service
#2` and the lambda. Note: This is a super simplified example (☞ﾟヮﾟ)☞


![techspec](https://i.imgur.com/DJPYoEr.png)


When the tech-spec is finished, we will start implementing which should be
easy if the tech-spec is detailed enough and we don't encounter some weird
problem. Then we do the testing (both by myself and QA team). If everything is
okay, we will release it 🎉✨


### Some interesting problems

This section is about the problems that the backend team or I encounter and I
found it interesting to talk about.

##### Memory Leak

Yep, on one release suddenly the memory of production service exceeds a
threshold and an alert is sent to the team. It was a disaster 😂, because no
one knows how it happened. I didn't have a chance to be involved in fixing
this issue that much but what I found is profiling a NodeJS application is
hard as hell (or it's because we lack the skill to do it). When we have so
many libraries that are in use at the same time, it's just too much
information to filter. And JS/TS code is hard to be memory safe or efficient
because the language is just not building for this use case.


<br>

I think the main takeaway is, that if we use other languages like Rust, Go or
Elixir this can still happen but fixing it should be much easier (especially
on Rust because we can just look at the code). Well, I'm thinking about doing
a comparison between these languages to check if this is true or not.

##### Moleculer Serialization

![moleculer](https://i.imgur.com/Vgpd254.png)

I wasted like 2 days, confused about why I can't pass `Map` between services
in moleculer (we use native JSON serializer). Remember this, you need to read
the documents 😂.

##### The config hell

With the help of tools like Serverless or Terraform, configuration is easier
but we can still mess it up and some things still need to be manually edited.
So, remember to recheck your configuration or you could possibly mess up the
prod service (hopefully you have some automated check 🤷‍♂️)

## Conclusion (and some opinions)

I've learned so much from working as a backend intern at Amity both the
programming side and social side. My colleagues were all super nice and
friendly, and the work is ok (I don't like JS/TS, so the work is not that fun
🤣), some takeaways that I can think of 

- Try to always learn about new technology so you can think of a wide variety
of solutions.

- Design a system that will work with the smallest cost (both money and time)
as possible. Also, try to measure the load that the system is expected to take
what could went wrong when designing a system for an unknown load 🤷‍♂️.

- Surprising thing: you don't need to have a computer science/engineer
background to work as a QA or Engineer.

- Team's proficiency needs to be considered when choosing the tech stack (but
I also think that there's a threshold that we need to move on to better tech
e.g. ditch the JS)
