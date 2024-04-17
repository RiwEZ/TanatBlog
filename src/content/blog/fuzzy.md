---
title: Fuzzy Technical Indicator
description: My bachelor's final project at Chiang Mai Univerisity.
slug: fuzzy
createdAt: '2024-03-30'
updatedAt: '2024-04-17'
---

This blog will be about my graduation project for my Bachelor of Engineering, Computer Engineering
at Chiang Mai University. So, what is it? and how did me and my friend make it?

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
> - $T(X)$ is the set of terms of X e.g. little cold, cold, hot
> - $U$ is a universe of discourse of all terms
> - $\vec{m}$ is a list of membership function $m$ associate with each term in $T(X)$

We can think of linguistic variable as a collection of fuzzy sets with the same $U$. It will be used
to describe fuzzy system inputs and outputs.

<figure>
<img src="https://imgur.com/XgIAwAN.png" loading="lazy" />
<figcaption>
<center>
Linguistic Variable Example
</center>
</figcaption>
</figure>

Then, how do we use these concepts to do a reasoning? First, we need to have *fuzzy rules* e.g.
if TEMP is HOT then FANSPEED is HIGH. From the example, TEMP and FANSPEED are linguistic variables 
and HOT and HIGH are terms. Then we can used this rule on a fuzzy inference system (FIS) to get the 
output we needed. These 2 articles from MathWorks explains how all of this work in more details 
if you want to check it out, [Fuzzy vs Nonfuzzy Logic](https://www.mathworks.com/help/fuzzy/an-introductory-example-fuzzy-versus-nonfuzzy-logic.html) 
and [Fuzzy Inference Process](https://www.mathworks.com/help/fuzzy/fuzzy-inference-process.html)

<br>

In our project we implemented *Mamdani FIS* which you can also read more on how does it work on 
[Mamdani and Sugeno Fuzzy Inference Systems](https://www.mathworks.com/help/fuzzy/types-of-fuzzy-inference-systems.html).
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
As you can see from the above code, I implemented fuzzy logic code in functional style which is close 
to the definition of all concepts listed above. This makes the code more readable and easier to debug 
(no side effects). Functional programming concep like higher-order function make fuzzy operations from
the code example below very similar to the math (excluding rust things).

```rust
// composing functions make it easier to implement 
type F = Arc<dyn Fn(f64) -> f64 + Send + Sync>;

fn minf(mf: &F, input: f64) -> Shape {
    let f = Arc::clone(mf);

    Shape::default_with(Arc::new(move |x: f64| -> f64 { input.min((f)(x)) }))
}

fn std_unionf(mf1: &F, mf2: &F) -> Shape {
    let f1 = Arc::clone(mf1);
    let f2 = Arc::clone(mf2);

    Shape::default_with(Arc::new(move |x: f64| -> f64 { (f1)(x).max((f2)(x)) }))
}

fn std_intersectf(mf1: &F, mf2: &F) -> Shape {
    let f1 = Arc::clone(mf1);
    let f2 = Arc::clone(mf2);

    Shape::default_with(Arc::new(move |x: f64| -> f64 { (f1)(x).min((f2)(x)) }))
}

// ...
// using map and fold make it more readable
impl FuzzyEngine {
    // ...

    pub fn inference(&self, inputs: Vec<Option<f64>>) -> Option<Vec<FuzzySet>> {
        self.rules
            .iter()
            .map(|(cond, res)| {
                let aj = compute_aj(&self.inputs_var, cond, &inputs).unwrap();
                min_sets(&self.outputs_var, res, aj)
            })
            .fold(None::<Vec<FuzzySet>>, |acc, x| match acc {
                None => Some(x),
                Some(a) => Some(
                    a.iter()
                        .zip(x.iter())
                        .map(|(a, b)| a.std_union(b).unwrap())
                        .collect(),
                ),
            })
    }
}
```

##### Technical Indicators
This part is heavily inspired by [TradingView PineScript v5](https://www.tradingview.com/pine-script-reference/v5/).
The idea is TradingView already has a good API interface for creating varios technical indicators in 
PineScript, we can actually just copy the API interface and implemented its logic ourself.

<figure>
<img src="https://imgur.com/c253FWe.png" loading="lazy" />
<figcaption>
<center>
Technical Indicator Example (RSI)
</center>
</figcaption>
</figure>

From an example of RSI on above figure, how did we implement it?. As you can see on the code below,
our implementation is similar to PineScript implementation. We just wrap some of the calculations together
and then do some more operations to make the data suit our needs e.g. transform some values to NAN
for frontend, add datetime to each data point.


```rust
/* TradingView PineScript
pine_rsi(x, y) => 
    u = math.max(x - x[1], 0) // upward ta.change
    d = math.max(x[1] - x, 0) // downward ta.change
    rs = ta.rma(u, y) / ta.rma(d, y)
    res = 100 - 100 / (1 + rs)
    res
*/

// our implementation
pub fn rsi(data: &[Ohlc], n: usize) -> Vec<DTValue<f64>> {
    let (gain, loss) = utils::compute_gainloss(data); // both u and d
    let rs_vec = utils::rma_rs(&gain, &loss, n); // rs
    let rsi = rs_vec // res
        .par_iter()
        .map(|rs_o| {
            if let Some(rs) = rs_o {
                100.0 - 100.0 / (1.0 + rs)
            } else {
                100.0 - 100.0 / (1.0 + f64::NAN)
            }
        })
        .collect::<Vec<f64>>();

    embed_datetime(&rsi, data)
}
```
And one more thing you can see from the code `par_iter`, this is from [rayon](https://docs.rs/rayon/latest/rayon/) 
crate.

> **Rayon** is a data-parallelism library that makes it easy to convert sequential computations into parallel.
>
> -- Rayon README --

Basically, when we use `map` on `par_iter` we can split the works to each threads (this is often equal
to number of cpu cores, and you can set how many you want to use) by a technique called **work stealing**
which you can read more on how it work on [rayon FAQ](https://github.com/rayon-rs/rayon/blob/main/FAQ.md).

<br>

This simple changes from `iter` (sequential) to `par_iter` (parallel) improved calculation time for like 
2x if I remember correctly. From using 1 CPUs to 8 CPUs (on my old laptop), we can see why and this will
happen in so many more places in our code.

#### Web Server
<figure>
<img src="https://imgur.com/WNpAb5R.png" loading="lazy" />
<figcaption>
<center>
Overview of how each thread work together.
</center>
</figcaption>
</figure>

Our web server has 3 main threads which are
- main web server with actix (task producer)
- backtest runner (task consumer)
- pso runner (task consumer)

I used rust `std::thread` to create each thread.
And we also have a simple task queue using `mpsc` (multi-producer, single-consumer FIFO queue communication primitives)
on tho


we don't have graceful shutdown, so some time proces is dangling

TODO
what to write wa


```rust
#[tokio::main]
pub async fn backtest_consumer(
    mongo_uri: String,
    receiver: Receiver<BacktestJob>,
    counter: Data<Mutex<u32>>,
) {
    let client = ...;
    let db = web::Data::new(client);

    while let Ok(job) = receiver.recv() {
        // do the job
        {
            let mut c = counter.lock().unwrap();
            *c = c.saturating_sub(1);
        }
    }
}

fn main() {
    let (pso_sender, pso_receiver) = mpsc::channel();
    let (backtest_sender, backtest_receiver) = mpsc::channel();
    let pso_counter = web::Data::new(Mutex::new(0u32));
    let backtest_counter = web::Data::new(Mutex::new(0u32));

    let t0 = thread::spawn(...);
    let t1 = thread::spawn(...);
    let t2 = thread::spawn(...);

    t0.join().expect("Main Service has panicked");
    t1.join().expect("PSO Consumer has panicked");
    t2.join().expect("Backtest Consumer has panicked");
}
```


##### Actix
We use [actix](https://actix.rs/) to write our web server. Initially, I used [rocket](https://rocket.rs/)
and I think I saw some posts about how actix is better than rocket then I just changed it on a whim 
(now, I don't know if it's actually true or not). 

<br>

Below, is an example of a route in actix and how actix is set up on our project. You can see the `#[get("rsi")]` 
, this is rust [proc macro](https://doc.rust-lang.org/reference/procedural-macros.html) which 
on actix tell what is the HTTP request type for each function. And you can see the arguments 
of `indicator_rsi` has 
- `web:Data<...>` this is the type for shared value e.g. database client, counter, etc.
- `web::Query<...>` this is for query parameters on the URL, which actix also check on runtime if the
type is matched or not.
- `HttpRequest` this is the whole request that we get.

```rust
// caching example
#[cached(
    time = 120,
    key = "String",
    convert = r#"{ format!("{}{}{:?}", length, data.1, cachable_dt()) }"#
)]
pub fn rsi_cached(data: (Vec<Ohlc>, String), length: usize) -> Vec<DTValue<f64>> {
    rsi(&data.0, length)
}


#[derive(Deserialize)]
struct QueryParams {
    symbol: String,
    interval: Option<Interval>,
}

// rsi route example
#[get("/rsi")]
async fn indicator_rsi(
    db: web::Data<Client>,
    params: web::Query<QueryParams>, 
    req: HttpRequest,
) -> ActixResult<HttpResponse> {
    let user = is_user_exist(req)?; // check if user in Bearer exist

    let symbol = &params.symbol;
    let interval = &params.interval;

    let data = fetch_symbol(&db, symbol, interval).await;
    Ok(HttpResponse::Ok().json(rsi_cached(data, user.rsi.length)))
}

#[actix_web::main]
async fn main_server(
    mongodb_uri: String,
    pso_sender: Sender<optimization::PSOTrainJob>,
    pso_counter: web::Data<Mutex<u32>>,
    backtest_sender: Sender<backtest::BacktestJob>,
    backtest_counter: web::Data<Mutex<u32>>,
) -> std::io::Result<()> {
    // ...

    let client = Client::with_uri_str(mongodb_uri)
        .await
        .expect("Failed to connect to Mongodb");

    HttpServer::new(move || {
        let cors = Cors::permissive();

        App::new()
            .wrap(Logger::new("%r %s %bbytes %Dms"))
            .wrap(cors)
            .app_data(web::Data::new(client.clone()))
            .app_data(web::Data::new(pso_sender.clone()))
            .app_data(web::Data::new(backtest_sender.clone()))
            .service(
                web::scope("/api/indicators")
                    .wrap(HttpAuthentication::bearer(auth_validator))
                    .service(indicator_rsi)
                    // ...
            )
    })
    .keep_alive(KeepAlive::Os)
    .bind((ip, port))?
    .run()
    .await
}
```
- 3 main threads
- rayon & PSO
- error handling
- caching

### Frontend

- api call, ddns trip, server shits

## Experiments & Results

## Some more interesting shits
Good story -> Price go up, for crypto currency. What if we can scrape some social media posts to 
check the current story sentimental.

## References
- [https://en.wikipedia.org/wiki/Fuzzy_set](https://en.wikipedia.org/wiki/Fuzzy_set)
- [https://www.sciencedirect.com/topics/engineering/linguistic-variable](https://www.sciencedirect.com/topics/engineering/linguistic-variable)

