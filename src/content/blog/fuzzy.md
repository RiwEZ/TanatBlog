---
title: Fuzzy Technical Indicator
description: My bachelor's final project at Chiang Mai Univerisity.
slug: fuzzy
createdAt: '2024-03-30'
updatedAt: '2024-04-10'
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

Next, I'll explain why did I not host it.

## Some more interesting shits
Good story -> Price go up, for crypto currency. What if we can scrape some social media posts to 
check the current story sentimental.

