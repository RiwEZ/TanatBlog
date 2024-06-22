---
title: Things I've Learned 2
description: Medias Backup Script and S3 Imgur in Go
slug: til2
updatedAt: '2024-06-22'
---

Yayyy, the continuation of "Things I've Learned" series. Now, I'll also included all my small 
side projects that I've done recently in this series too so I have something to regularly write on.

## Medias Backup Script
So on my [Thing I've Learned 1](/TanatBlog/blog/til1/) blog, I have an idea for doing a backup script for all blog medias.
I've already implemented it, and on this blog I'll describe how it work.

<br>

The script is just a simple ~150 lines of Go code with a few standard libraries. How it work is 
pretty straight forward too. For each blog we do
1. We gather all medias link from the blog markdown file by using Go regex and also check if it's 
a valid URL.
    ```
	<img\s+[^>]*src="([^"]+)"       // for <img src="..."/>
	<source\s+[^>]*src="([^"]+)"    // for <source src="..." />
	!\[.*?\]\(([^\)]+)              // for markdown ![](...)
    ```
2. Download all medias in it via `HTTP GET` request, this step is the most problemetic step because 
I've used [imgur](https://imgur.com/) to host some images and it just always throw `429` to me. 
As I go through what is the differences between my GET request on the browser and my script, I 
found out that Go `http` library does not set `User-Agent` header and imgur need it, so the problem
is solved. (This tooks me like 2 hour to figured it out 🤦‍♂️)
3. Just write the files to a specific backup folder, the interesting part in this step would be that 
Go `os.MkdirAll` and `os.WriteFile` both require the unix permission code which I specify `0766` 
for a directory and `0644` for a file. You may notice the leading zero, and wonder why we need it?
So in Go a literal with leading zero is octal number meaning `0777 = 0b 111 111 111`.

Note: The unix file permission can be break down to this
```
// own -> owner
// gro -> group
// oth -> others

  | own | gro | oth | 
d | rwx | r-x | r-x |
- | rw- | r-- | r-- |

// 1 bit most significant bit and 9 least significant bits
d | rwx | rwx | rwx |
```

## S3-Imgur (kind of)
This idea comes from the previous [Thing I've Learned](/TanatBlog/blog/til1) too. So, instead of 
using AWS root account to upload a media for my blog I implement a basic interface for managing 
medias using S3 as a data store. Actually, it's just a simple CMS that is implenmented by using
Go, Templ and HTMX which I have want to try for so long.

<figure>
<video controls="true" class="w-full" />
<source src="https://deuykboxmuiw2.cloudfront.net/til2--2024-06-22 15-44-29.mp4" type="video/mp4">
</video>
<figcaption>
<center>An overview of how s3-imgur work.</center>
</figcaption>
</figure>

Now, I'll explain how all of this works
<figure>
<img src="https://deuykboxmuiw2.cloudfront.net/til2--htmx-templ.png" loading="lazy" />
<figcaption>
<center>Lorem</center>
</figcaption>
</figure>

HTMX Part ..., Templ Part ...

<br>

If anyone want to try this, at the time of writing AWS free tier will be enough for everything
so you can
1. Setup AWS account, Create a new S3 bucket, Setup Cloudfront for that bucket, 
Setup IAM for that S3 (You can google for these, there should be plenty of resources on the internet).
2. Download or store the credentials of the IAM accouont that you have created.
3. Clone my [repository](https://github.com/RiwEZ/TanatBlog) and then 
    ```
    cd scripts/s3-imgur && go build main.go
    ```
4. Create a new `.env` file that has the same format as `example.env` and specify those 
environment variables.
5. Run the binary and start interacting with the application.

## Lineman Wongnai Interview

1. How to do rolling deployment in detail? 
    nginx & pod changing, redireciting traffick via DNS

2. How to update the API to have new status while there's miliion of user using it
- Old app use API with an old flag
- New app use API with a new flag
- How to migrate large DB?, rolling shits 
- What happend when u read the old version document -> update it too
- You need to be able to tell a story about all of this process in a detailed steps

- deploy steps, 1. deploy code 2. migrate db 3. others thing


## TODO
- Backend, Node & PHP & Vue

Setup postgres, and do some basic API shits with NodeJS

Condo Research Website

- A map with condo location with list of rent prices?
- Add it manually via some kind of thing

