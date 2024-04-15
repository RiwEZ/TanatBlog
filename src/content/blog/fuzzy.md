---
title: Fuzzy Technical Indicator
description: My bachelor's final project at Chiang Mai Univerisity.
slug: fuzzy
createdAt: '2024-03-30'
updatedAt: '2024-04-12'
---

So this blog will be about my graduation project for my Bachelor of Engineering, Computer Engineering
at Chiang Mai University. What is it? and how did me and my friend make it?

## What are we trying to do?

In **technical analysis** (for trading), there are many **technical indicators** that help with 
deicision making in the market. A **technical indicator** is a mathematical calculation based 
on historical prices or volume. The purpose of it is to forecast financial market direction.

<figure>
<img src="https://www.investopedia.com/thmb/eOSRgZbllIESMSBnKSk7fA3jptQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_Final_Technical_Analysis_Strategies_for_Beginners_Sep_2020-01-412a1ba6af834a74a852cbc32e5d6f7c.jpg" />
<figcaption>
<center>
Examples of technical analyis from <a href="https://www.investopedia.com/articles/active-trading/102914/technical-analysis-strategies-beginners.asp">Investopedia</a>
</center>
</figcaption>
</figure>

So, how can technical indicator help? To make it easier to understand let's look at an example 
of Relative Strength Index (RSI). The common way to interpret RSI is 
```
If RSI > 70:
    overbought -> consider selling
If RSI < 30:
    oversold -> consider buying
```
Then we can use this information to do manual or automated trading. Instead of fixed value rule 
like previous example, we are trying to use fuzzy rule to do something similar because 
- Financial market is volatile and uncertain.
- Fuzzy Logic excel in recognising, representing, manipulating, interpreting, and using data that 
are vauge and lack certainty. 

We think that Fuzzy Logic can help improving technical indicator usage.
<figure>
<img src="https://imgur.com/XeQJjYB.png" />
<figcaption>
<center>
Simple example of Fuzzy Logic used with RSI
</center>
</figcaption>
</figure>

Also, If we use many of these technical indicators it can be hard to interpret each one simultaneously.
What if we have a system that we can specify each individual or combination of indicators interpretation
then the system give output of 1 or 2 value that is easy to understand.

<br>

So basically we need to be able to
- Provide default indicators: RSI, MACD, ADX, Aroon Indicator, On-Balance Volume, Bollinger Bands
- Display market data with at least 1 hour interval for 
    - Stock market : AAPL/USD, TSLA/USD, etc.
    - Cryptocurrency market : BTC/USDT, ETH/USDT
- Provide default setup (linguistic variables, fuzzy rules) for our fuzzy technical indicator.
    - But users can also customize linguistic variables and fuzzy rules to their likes. 
    - The default setup should be automatically updated every week.
- Provide the web application which will contain 
    - Candlestick chart of the market 
    - Our fuzzy logic output (line graph) 
    - UI for selecting market, customize fuzzy rules, customize linguistic variables 

And some optional things that could be added (and we've done)
- Linguistic variables tuning to a specific strategy with backtesting using particle swarm optimization (PSO). 
- Provide a Money Management system using modified optimal-F (liquid-F).


## The technical part 🗿
So how did we implement the idea? First you can check out the website through this [video](https://www.youtube.com/watch?v=vPOLlNmZDSU)
from my friend (yes, it's in Thai). Right now, I'm currently not hosting the website so you guys can
not visit it. 

<figure>
<img src="https://imgur.com/puSZftM.png" />
<figcaption>
<center>
Architecture Overview
</center>
</figcaption>
</figure>

Next, I'll explain why I am not hosting it. So as we can see from above *Architecture Overview* figure, 
we see the image of old laptop on the bottom left side. That's my own server that I used to deploy 
the website to provide the demo for others. 

<br>

By port-forwarding a specific port for ISP DDNS, we can 
access my service through a link like this [http://tanat.3bbddns.com:50711/](http://tanat.3bbddns.com:50711/).
And then when I wanna deploy newer version I need to 
1. Build the docker image for both backend and frontend.
2. `scp` (Secure Copy Command) the docker image to the server like this `scp *.tar public@192.168.1.8:`
3. Load the docker image on the server and run it.

I think these steps can be automated through something like self-hosted gitlab but I don't have the time 
to try it when I was doing this project :C.

### Backend
Our backend code can be splited into these 3 components
- **lambda**: for updating the data on the MongoDB
- **lib**: fuzzy logic, technical indicator
- **web-server**: using actix to handle all requests

#### AWS Lambda 
How did we get the all the market data? Basically, we have a program to seed the initial data to MongoDB.
And then we use AWS Lambda with AWS EventBridge Scheduler as we can on the *Architecture Overview* figure 
to update the data every 30 minutes. The APIs that we use are 
- Binance API (free-tier)
- AlphaVantage API (free-tier) 

Below is a part of the code for our lambda using [cargo-lambda](https://github.com/cargo-lambda/cargo-lambda) 
library to help in building for AWS.
```rust
async fn func(_event: LambdaEvent<Value>) -> Result<Value, lambda_runtime::Error> {
    // ... db config code 
    let db = client.database("...");

    // update stock data
    let symbol_list = vec!["AAPL", "IBM", "JPM", "MSFT", "NKE", "TSLA"];
    for symbol in symbol_list {
        update_stock(&format!("{symbol}/USD"), &db).await?;
        thread::sleep(Duration::from_secs(15));
    }

    // update crypto currency data
    let market: Market = Binance::new(None, None);
    let coins = vec!["BTC/USDT", "ETH/USDT", "BNB/USDT"];
    for c in coins {
        update_crypto(&db, &market, &c).await?;
    }

    Ok(json!( { "message": "Okay"}))
}
```

#### Library Code
We have 2 library that we need write and one is fuzzy logic. First, I'll explain what **fuzzy logic** is.

##### Fuzzy Logic
Imagine that you are in a room with 25 celsius temperature, is it cold for you? what about others?
We can see that there are some vague concepts when we think about room temperature, instead of saying it's
cold we often say "it's a little bit cold" or "yes, it's cold but not that cold". Fuzzy Logic is just
a mathemetical concepts to represent feelings like that instead of using crisp set (cold or hot) we 
use fuzzy set (a little hot, a little cold, very cold). 

<br>

So how does fuzzy set looks like? From the *Linguisctic Variable Example* figure below, we can see 
the graph of each temperature label, that graph is the fuzzy set.
> Definition: A fuzzy set is a pair of $(U, m)$ where $U$ is a set called *universe of discourse*, and
> $m : U \rightarrow [0, 1]$ is a *membership function*. For each $x \in U$, the value $m(x)$ is called
> *grade of membership* of $x$ in $U$

And we need to implement these fuzzy operations too
- standard union, standard intersect
- degree of arbitrary $x$
- defuzzification method (centroid defuzzification)

> Definition: A linguistic variable is a tuple $(X, T(X), U, \vec{m})$ where
> - $X$ is the name of variable e.g. temperature
> - $T(X)$ is the set of terms of X e.g. cold, little cold, hot
> - $U$ is a universe of discourse of all terms
> - $\vec{m}$ is a list of membership function $m$ associate with each term in $T(X)$

We can think of linguistic variable as a collection of fuzzy sets, ...TODO

<figure>
<img src="https://imgur.com/XgIAwAN.png" loading="lazy" />
<figcaption>
<center>
Linguistic Variable Example
</center>
</figcaption>
</figure>


```rust
// example of how my fuzzy logic lib looks like
let f_engine = FuzzyEngine::new()
    .add_cond(LinguisticVar::new(
        vec![
            ("cold", triangle(15f64, 1.0, 10f64)),
            ("little cold", triangle(28f64, 1.0, 10f64)),
            ("hot", triangle(40f64, 1.0, 20f64)),
        ],
        (0f64, 50f64),
    ))
    .add_cond(LinguisticVar::new(
        vec![
            ("low", triangle(25f64, 1.0, 25f64)),
            ("normal", triangle(45f64, 1.0, 30f64)),
            ("high", triangle(85f64, 1.0, 25f64)),
        ],
        (0f64, 100f64),
    ))
    .add_output(LinguisticVar::new(
        vec![
            ("weak", triangle(0f64, 1.0, 15f64)),
            ("strong", triangle(30f64, 1.0, 30f64)),
        ],
        (0f64, 50f64),
    ))
    .add_rule(vec![Some("cold"), Some("low")], vec![Some("weak")])
    .add_rule(vec![Some("little cold"), Some("low")], vec![Some("weak")])
    .add_rule(vec![Some("hot"), Some("low")], vec![Some("strong")]);

let result = f_engine.inference(vec![Some(19f64), Some(10f64)]).unwrap();
```
- exlpain what fuzzy logic is in simplest form
- rayon 
- functional style api 


#### Web Server



### Frontend


## Some more interesting shits
Good story -> Price go up, for crypto currency. What if we can scrape some social media posts to 
check the current story sentimental.


## References
- [https://en.wikipedia.org/wiki/Fuzzy_set](https://en.wikipedia.org/wiki/Fuzzy_set)

