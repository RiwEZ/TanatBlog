---
title: Things I've Learned 1
description: How an LSP work, Learning Go, NestJS & GraphQL
slug: til1
updatedAt: '2024-06-09'
---
On the other day, I found this article about [what-to-blog-about](https://simonwillison.net/2022/Nov/6/what-to-blog-about/)
from [@eatonphil](https://x.com/eatonphil) tweet. And the "Today I Learned" concept sounded fun,
so I decided to tweak it to my own way. Cheers, for the beginning of "Things I've Learned" which will
contain anything that I've learned recently whether through reading, doing small projects or any other 
things.

## How an LSP work?
Recently, I have an idea about an LSP for the OpenAPI so that we can write the API specification more easily.
The main feature I wanted is the `$ref` autocomplete, hover and go to definition.  

<figure>
<img src="https://microsoft.github.io/language-server-protocol/overviews/lsp/img/language-server-sequence.png" loading="lazy" />
<figcaption>
<center>Example of how tool and a language server 
communicate during editing from an
<a href="https://microsoft.github.io/language-server-protocol/overviews/lsp/overview/">official overview</a>
</center>
</figcaption>
</figure>

But, at the time of writing I also found out about [TypeSpec](https://typespec.io/) which seems to 
be a better way to do this kind of API specification work. So this is gonna be like how an attempted
to create an LSP look like (it's definitely incomplete, and I don't think I'll continue developing it lol).

<br>

So I actually learn how an LSP work by try to implement the LSP following thig 
[video](https://youtu.be/YsdlcQoHqPY?si=AG_tuk_loGFvwoaI). Basically, LSP 
(Language Server Protocol) is a standard protocol for editor/IDE and a language server to communicate
with each other. For an example when you hover certain part of the code, the client on editor will
request a sever with method `textDocument/Hover`, and the server can respond the hover to the client.

<figure>
<img src="https://deuykboxmuiw2.cloudfront.net/output.gif" loading="lazy" />
<figcaption>
<center>An example of an hover that I've done</center>
</figcaption>
</figure>

So, the way that I did it is simple, when the the client sent the whole document to the server via
`textDocument/onOpen` or `textDocument/onChange` I use [tree-sitter](https://github.com/tree-sitter/tree-sitter)
to parse the text and store the location of `openapi` and `info` keys. And then when the client 
request for hover at the position that inside one of the keys that we have stored, we can answer 
the content that we want to the client. 

<br>

Lastly, I don't think that I will continute to develop it further because I think TypeSpec is a 
better way to do this kind of work.
Also, the code that I write is on this [github repoitory](https://github.com/RiwEZ/open-api-lsp)

## Learning Go
Right now, I'm also learning Go via writing some simple programs. (the LSP above is one of them)

<br>

One of the program that I write is the [docker-stats-exporter](https://github.com/RiwEZ/docker-stats-exporter)
which is a simple program that will pull data of each docker containers using docker api.
And then publishing it to [Prometheus](https://prometheus.io/).

<figure>
<video controls="true">
<source src="https://deuykboxmuiw2.cloudfront.net/docker-stats.mp4" type="video/mp4">
</video>
<figcaption>
<center>A <a href="https://grafana.com/">Grafana</a> dashboard using data source from my docker-stats-exporter</center>
</figcaption>
</figure>

And another program that I write since like 8-9 months ago is the [cmu_reg_ics_scraper](https://github.com/RiwEZ/cmu_reg_ics_scraper)
lol. The steps to use the program are
1. Copy the schedule's table html contents from the university registration website.
2. Receive a file as an input, the file need to have all the necessary information to generate
the `.ics` file for google calendar.
    ```
    21/11/2023 // semester start date
    16/01/2024 // midterm start date
    29/01/2024 // midterm end date
    17/03/2024 // semester end date
    <div data-v-3b ... // the content of copied html element
    ```
3. The program will parse the file, and output the `.ics` file that we can import to google calendar.

<figure>
<img src="https://deuykboxmuiw2.cloudfront.net/calendar-cmu.png" loading="lazy" />
<figcaption>
<center>A part of the calendar that is generated from my program.</center>
</figcaption>
</figure>

*Note:* `.ics` (Internet Calendaring and Scheduling Core Object Specification / iCalendar) file 
is a standard media type for sharing calendaring and scheduling information.

## NestJS & GraphQL
Another thing that I've learned recently are [NestJS](https://nestjs.com/) and [GraphQL](https://graphql.org/).
The reason that I got a chance to learn these things is the assignment from one of the companies 
I applied to while finding a job which is to implement a simple service in NestJS and GraphQL.

<br>

The requirements of the service can be summarize as a service for handling a job application 
as shown as the figure below.

<figure>
<img src="https://deuykboxmuiw2.cloudfront.net/nestjs-graphql.png" loading="lazy" />
<figcaption>
<center>2 side of users and their actions</center>
</figcaption>
</figure>

I've implemented a basic [jwt](https://jwt.io/) authentication with bcrypt hashed password on
the MongoDB (these are only the REST endpoints in the project). And I've also implemendted some 
GraphQL query that looks like this
```graphql
mutation CreateJob {
    createJob(
        jobData: {
            title: "software dev ${i}"
            description: "25k"
            isOpen: true
        }
    ) {
        id
        title
        description
        isOpen
    }
}

query Jobs {
    jobs {
        id
        title
        description
        isOpen
    }
}
```
And I've also implemented some basic NestJS role guard and permission system 
to prevent some invalid actions such as "candidate should not be able to watch the list of applicants",
"another company should not be able to create a job for other company" etc.

<br>

While I think this is not a best way to use NestJS & GraphQL (because it's my first time)
I think the whole things is interesting, you can checkout the repository on this [link](https://github.com/RiwEZ/NestJS-JobApplication).

## Using S3 and CloudFront
While writing this blog I also want to try using AWS S3 and CloudFront for hosting medias for this
blog, because I think it'll be much faster than imgur (which it is) and now I actually own 
my medias (kind of, it's still in the cloud).

<br>

The setup is easy, I just followed a [guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html)
from AWS, so I did not look into the configurations that much (this could be another blog). And the 
current way to upload a media is through AWS root account only which is not good, maybe I'll implement
some simple interface to use this.

<br>

I also wanna note an idea of how should I create a backup for all my blogs 🗿. 
- First, the markdown content is already on github and my local machine. This should be good for now.
- Second, all the medias (the problem). Some are on external website, some are on imgur, and some are 
on S3 now. I think I need some kind of web crawler that will download all the medias on my blogs
and maybe make a zip file from them.

> The end of the first blog of "Things I've Learned" series yey, I hope I'll get a chance to continue 
> writing more for this series. Thank you to everyone who is reading to this point.
