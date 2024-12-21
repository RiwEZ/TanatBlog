---
title: I started my first job at Lineman Wongnai
description: How was work at LMWN after ~5 months
slug: lmwn1
updatedAt: '2024-12-21'
---

Yey, finally have time for some blog writing. So recently I have joined [LINE MAN Wongnai](https://lmwn.com/) 
and now it's a time for yearly self-review so I thought I should do it along with this blog!

## How's work so far?
So I started working with LINE MAN Wongnai (POS team) on August, it has been around 5 months of 
officially working as a full time software engineer, mostly backend things. 
So, what am I doing in the past 5 months?

<br>

Mostly dealing with technical debts, fixing bugs and write some database migration tools, actually 
I have not developed a new feature yet since I started working lol. But my team should finished this 
project by the first month of next year (I really hope we finished it). So what's the problems?

<br>

I will simplify it in one phrase "merging shits together, so we can actually maintain them".

## What Have I learned?
So the codes is written in PHP, Javascript, Go, and some Java. I definitely have gotten better 
at writing PHP code, pure JS with JSDoc and Go too. I also have a chance to check out some of their 
internal tools which are useful but I think somewhat lacking in the documentation, I occasionally 
have to look at the code to understand what is going on but I think it's acceptable.

<figure>
<img src="https://deuykboxmuiw2.cloudfront.net/lmwn--lmwn_lang_rants.png" loading="lazy" />
<figcaption>
<center>Languages & Tools Rants</center>
</figcaption>
</figure>

PostgreSQL is really nice though, working with SQL feel super simple. But the current DB schema 
design is super werid 🤦‍♂️.

<br>

And I think the biggest thing I have learned, is how corporate job feels like. There're some 
inconveniences when you're one of the largest in the market, and having a much larger team means
there's really a need for super clear communication. Or someone will get confused and everything will 
become slower (like I did at first :C).

<br>

Actually, there are some deployment incidents because of my miscommunication too. I need to improve on this 
next year by being super clear of what to do when deploying and be sure to check how the deployment 
work or else there will be some configuration shits that will make something broken.

## What are the things I'm most proud of this year?
- I have rewrote one service to be much more cleaner and added unit tests for it. Atleast for now, when I need 
to write or read codes on that repoitory I think I'm able to do it much faster. (because it's easier to 
understand now, or maybe because of my bias) 

- In the past, on one `node` repository we do not have typescript config on it so whenever 
we write code we did not get to use features from LSP such as auto-complete, document hover, diagnostics, etc. 
Now, that I added typescript config to it, I think using it with `JSDoc` make writing new code faster 
and cleaner because we know the shape of data passing through each functions from the type. 
I don't know if it will help anyone other than me, but I think it's super useful for me.

- I'm pretty involved in how the database migration tool work, from the backend side to frontend side.
Fixed one weird bug about queue name, so basically we have the same Redis that is used to create a
jobs queue on `dev` and `staging` environment. And this means if we use the tool on staging, sometimes
it will go to `dev` environment. Finding this bug root cause is kinda hard because I can't replicate 
it everytime but fixing it is super easy when we know the root cause.

## What could I have done better?
- I think I could spent more time on code review, and leave more good comments but I also think 
this need to come from more experiences with the codebases and the team too.

- I think I can improve my communication skill too, just be more clear of what I want to say 
when doing code review or having a discussion.

- Sometimes I just don't ask questions because I wanna figured it out how something work by myself 
which is also not a bad thing I think (it helps me to learn faster). But just need to maintain 
balance on learning and getting things done.

## What to focus next year?
- I want to improve developer experiences on the repository that I worked on, e.g. better tests, 
faster CI pipeline, add a standard formatter/linter, etc. So I will not have a feeling like I 
don't wanna work on this repository. If it's can just be a neutral feeling I think
it's good enough.

- I want to learn more on infrastructures side, how our kubernetes cluster work right now. 
How everything is deployed now, and how can it be improved.

- I want us to have a standard for API development for example 
    - I think we should have 1 source or truth on how the endpoint work in the RFC and 
    have a API document that correspond to it (maybe try using [typespec](https://typespec.io/)?) 
    I think [Binance API Doc](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints)
    is a good example for good document.
    - Have a proper way to version endpoints and remove deprecated endpoints. If we can remove
    all of those old legacy codes while everthing still work, 
    I think it's a win for developer (less code less pain 😆). 


## Conclusion
Currently, work is fine but I hope next year I have a chance to work on more challenging project like
rewriting some services :D (I wanna ditch the php backend so much).

<figure>
<img src="https://deuykboxmuiw2.cloudfront.net/lmwn--IMG_3174.jpg" loading="lazy" class="md:h-[500px]" />
<figcaption>
<center>Random Picture From The Office @ One Bangkok</center>
</figcaption>
</figure>
