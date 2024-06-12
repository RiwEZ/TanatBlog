---
title: Fuzzy Technical Indicator
description: My bachelor's final project at Chiang Mai Univerisity.
slug: fuzzy
updatedAt: '2024-04-21'
---

This blog will be about my graduation project for my Bachelor of Engineering, Computer Engineering
at Chiang Mai University. So, what is it? and how did me and my friend make it?

## What are we trying to do?

In **technical analysis** (for trading), there are many **technical indicators** that help with 
deicision making in the market. A **technical indicator** is a mathematical calculation based 
on historical prices or volume. The purpose of it is to forecast financial market direction.

<figure>
<img src="https://www.investopedia.com/thmb/eOSRgZbllIESMSBnKSk7fA3jptQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dotdash_Final_Technical_Analysis_Strategies_for_Beginners_Sep_2020-01-412a1ba6af834a74a852cbc32e5d6f7c.jpg" loading="lazy" />
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
<img src="https://i.imgur.com/XeQJjYB.png" loading="lazy" />
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
<img src="https://i.imgur.com/puSZftM.png" loading="lazy" />
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
<img src="https://i.imgur.com/XgIAwAN.png" loading="lazy" />
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
<img src="https://i.imgur.com/c253FWe.png" loading="lazy" />
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
> -- rayon README --

Basically, when we use `map` on `par_iter` we can split the works to each threads (this is often equal
to number of cpu cores, and you can set how many you want to use) by a technique called **work stealing**
which you can read more on how it work on [rayon FAQ](https://github.com/rayon-rs/rayon/blob/main/FAQ.md).

<br>

This simple changes from `iter` (sequential) to `par_iter` (parallel) improved calculation time for like 
2x if I remember correctly. From using 1 CPUs to 8 CPUs (on my old laptop), we can see why and this will
happen in so many more places in our code.

#### Web Server
<figure>
<img src="https://i.imgur.com/WNpAb5R.png" loading="lazy" />
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

I used rust `std::thread` to create each thread and used `mpsc` (multi-producer, single-consumer FIFO queue communication primitives)
as a simple tasks queue. We also have a number of tasks in queue by using `web::Data<Mutex>` 
(yes, it's actix `Arc<Mutex>`) to enable us to share variable across threads. 

```rust
// consumer example
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
```
Unfortunately, we don't have graceful shutdown. So when consumer panicked because of unknown reasons 
(we didn't handle it) the process can be dangling, and we need to kill it using `kill -9 {pid}`. 
This can be fixed by implementing graceful shutdown, maybe similar to this [article](https://tokio.rs/tokio/topics/shutdown)
from tokio but we don't have time :C.

##### Actix
As we have stated, we use [actix](https://actix.rs/) to write our web server. Initially, I used [rocket](https://rocket.rs/)
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
Also, you can see the `rsi_cached` on above code in `indicator_rsi` function. It's a function which 
use [cached](https://docs.rs/cached/latest/cached/) crate proc macro to cache the calculation of `rsi`
which can take time to finished in memory. The cache key from example below are composed from
- `length`, `data.1` which are arguments of the function, this is use to distiguish different RSI.
- `cachable_dt()` which is a string value that will be the same on 30 mins period because our lambda
update the market data every 30 mins and RSI depends on market data.

I think we have cached almost all routes that need to be cached. This make the whole server much faster 
when receiving request that can be retrived from the cache. Using in-memory caching also simplified 
deploying process because we don't to deploy other services like [Redis](https://redis.io/) or 
[Memcached](https://memcached.org/).

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
```
Error handling in rust is also a great experience. We can use `Result<T, E>` (haskell `Either`) type to 
propagate error up (through `?`) to where we want to handle them. And, you can see that actix 
has its own `ActixResult<T>` too which is just short hand for `Result<T, E = actix_web::error::Error>`. 
You can see from the code below that we can define our custom error with the help of [thiserror](https://docs.rs/thiserror/latest/thiserror/)
crate to make implementing `Display` trait for each error much easier and then map that to `actix_web::Error`
which help in create an error response properly.

```rust
#[derive(thiserror::Error, Debug)]
pub enum CustomError {
    #[error("Settings not found")]
    SettingsNotFound,
    // ...
}

pub fn map_custom_err(e: CustomError) -> actix_web::Error {
    use CustomError::*;

    match e {
        SettingsNotFound
        | ... => ErrorNotFound(e.to_string()),
        // ...
    }
}

// settings.rs 
async fn get_linguistic_variables(
    db: &web::Data<Client>,
    preset: &String,
    username: &String,
) -> Result<BTreeMap<String, LinguisticVarDTO>, CustomError> {
    // ...
    if let Some(doc) = doc_opt {
        return Ok(...);
    }
    Err(CustomError::SettingsNotFound)
}

pub async fn get_setting(
    db: web::Data<Client>,
    preset: &String,
    username: &String,
) -> Result<SettingsDTO, CustomError> {
    Ok(SettingsDTO {
        linguisticVariables: get_linguistic_variables(&db, preset, username).await?,
        fuzzyRules: get_fuzzy_rules(&db, preset, username).await?,
    })
}

// main.rs
#[get("")]
async fn get_settings(
    db: web::Data<Client>,
    query: web::Query<PresetQueryParam>,
    req: HttpRequest,
) -> ActixResult<HttpResponse> {
    let username = is_user_exist(req)?.username;
    let result = settings::get_setting(db, &query.preset, &username)
        .await
        .map_err(map_custom_err)?;
    Ok(HttpResponse::Ok().json(result))
}
```
##### Particle Swarm Optimization, Backtesting, Liquid-F
Now, let's talk about the remaining concepts that we have implemented on our web server.

<br>

**Backtesting** is a simulation of some strategy apply over historical data, in our case it's the 
strategy that is using our fuzzy technical indicator. The algorithm in our implementation is simple
just 
```
loop over market data from t0 to t1 then
    1. realize any open positions (if it have reached take profit or stop loss)
    2. if we should enter a new position then enter it otherwise do nothing
```

<figure>
<img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/ParticleSwarmArrowsAnimation.gif" loading="lazy" />
<figcaption>
<center>
A particle swarm searching for the global minimum of a function from the
<a href=https://en.wikipedia.org/wiki/Particle_swarm_optimization>wiki</a>.
</center>
</figcaption>
</figure>

**Particle Swarm Optimization** (PSO) is a kind of evolutionaly algorithm that try to mimick bird flock 
or fish school. It work by having a population of candidate solutions called *particles*, then we try to
move these particles through search-space according to some math with the particles's position and velocity.

<br>

In our implementation, we use simple a local best PSO to tune the linguistic variable of each 
fuzzy technical indicator. We also use rayon to make the performance much better by splitting the 
training of each group to each thread using `par_iter`. And by using this objective function
$$
f = 
\begin{cases}
    \infty & |\text{trades}| = 0 \\
    -1 \times ((\text{np} - \text{np}_r) + (\text{mdd}_r - \text{mdd})) & \text{otherwise} \\ 
\end{cases}
$$
where 
- $\text{np}$ is net profit (%) of all trades when we do a backtest.
- $\text{mdd}$ is [maximum drawdown](https://www.investopedia.com/terms/m/maximum-drawdown-mdd.asp) 
(%) from when we do a backtest.  
- $|\text{trades}|$ is a number of trades that we have done.
- $\text{np}_r$ and $\text{mdd}_r$ are references from the initial backtest with the start's configuration.
We use these references to fix a problem where PSO does not make the fuzzy technical indicator better by
enforcing them to have a better objective function iff its backtest result is better in term of net profit
and maximum drawdown.

We are trying to optimize the linguistic variables of our fuzzy technical indicator to make it able to
gain more profit while having low drawdown. Actually, we could change the objective function to make
it better in other aspects but this idea should be in further development.

<figure>
<img src="https://i.imgur.com/dOmQy57.png" loading="lazy" />
<figcaption>
<center>Parameters of the linguistic variable that we will tune via PSO (a, b, c)</center>
</figcaption>
</figure>

<br>

**Liquid-F** is a money management strategy from this [paper](https://onlinelibrary.wiley.com/doi/abs/10.1002/int.21734) 
from Rodrigo Naranjo. Its idea is simple
- Increasing the percentage of money to invest when we are frequently winning the trades.
- Decreasing it when losing trades become frequent.

So, how does it work. By first find $f \in (0, 1)$ such that it maximize $\text{TWR}$ (terminal wealth relative)
which is 
$$
\text{TWR}(f) = \Pi_{i=1}^{n} \text{HPR}_i(f)
$$
$$
\text{HPR}_i(f) = 1 + \frac{f \cdot p_i(\text{realizedPnL})}{\text{riskFactor}}
$$
where 
- $n$ is the total number of positions
- $\text{HPR}$ (holding period return) is a ratio of profit and loss of each position.
- $p_i(\text{realizedPnL})$ is the profit and loss at position $i$
- $\text{riskFactor}$ is the absolute value of the worst $p_i(\text{realizedPnL})$

We find the value $f$ by simply looping through $0.01, 0.02, ..., 0.98, 0.99$ to find the value that
has maximum $\text{TWR}$. And then we use it to calculate
$$
\text{liquid}_f = 0.1f
$$
$$
\text{size} = \text{liquid}_f + \frac{(\text{output} - \text{threshold}) \cdot (f - \text{liquid}_f)}{\text{output}_{\text{max}} - \text{threshold}}
$$
where
- $\text{size}$ is the value that determine the size of a new position we will enter e.g. if we have 1000$
and the $\text{size} = 0.1$ then a new position will worth 100$. The term after $\text{liquid}_f$ means
greater signal strength → bigger size.
- $\text{liquid}_f$ is a base size, we only use 10% of the value $f$ because it's less risky.
- $\text{output}$ and $\text{output}_{\text{max}}$ is the signal strength from our technical indicator.
- $\text{threshold}$ is the value that when our signal reached it, we will enter a new position.

#### Remarks
Most of our work are in the backend part and there are much more implementation details that 
I didn't talk about. If you want to, you can checkout the code at 
[our repository](https://github.com/Fuzzy-Technical-Indicator/backend).

### Frontend
<figure>
<img src="https://i.imgur.com/6aukWw6.png" loading="lazy" />
<figcaption>
<center>One page of our website with candlestick graph of the market and our fuzzy technical indicator.</center>
</figcaption>
</figure>

We do our frontend with [SvelteKit](https://kit.svelte.dev/) which is a framework for developing 
a web application using [Svelte](https://svelte.dev/). It's similar to Next from React ecosystem 
or Nuxt from Vue ecosystem. Basically, Svelte is what render the UI using a **compiler** to transform
your `.svelte` code to javascript that will render HTML with CSS which is different from React and Vue.
And SvelteKit is other things that we need on the web such as router, build optimizations, ssr, etc.
You can read more about Svelte and SvelteKit on this [article](https://kit.svelte.dev/docs/introduction).

<br>

The graph shown on the figure above is powered by [lightweight-charts](https://github.com/tradingview/lightweight-charts)
from TradingView (which I think it's the number one in financial graph) and [svelte-lightweight-charts](https://github.com/trash-and-fire/svelte-lightweight-charts)
which is a wrapper from wrapper for lightweigt-charts in Svelte. If you guys remember the `f64::NAN` 
from the backend code on the section above, it's for this library to show an empty value.

<br>

One more interesting thing is how we communicate with the backend. As you know, we are deploying 
both frontend and backend on my old laptop so if we do server-side rendering we should be able to 
call the API within local network right? Yep, I didn't think about this when we are doing it at first so
the website is almost all client-side rendering 🤦‍♂️. 
This results in the website being super slow because we need to call the API over 
`http://tanat.3bbddns.com:50711/` which needs to go through ISP DDNS server (which is also not very fast)
, then ISP needs to route back to my old laptop which takes some time again and the response also 
need to route back to the client again.

<br>

The solution is simple, change to server-side rendering and deal with session state using cookies. 
Now, we can fetch the data directly in the same network by running both frontend and backend 
in the same [docker network](https://docs.docker.com/network/).
```ts
// exammple of the code for fetching data from the backend on SvelteKit
export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const username = cookies.get('session-username');

	const client = api(fetch, API_SERVER_URL);
	const options: RequestInit = {
		keepalive: true,
		headers: { Authorization: `Bearer ${username}` }
	};
	const presets = await client.getPresets(options);
	const bb = await client.bb(options);
	const users = await client.getUserSettings(options);

	return { presets, bb, users };
};
```
The remaining things that I haven't talked about is not that interesting, it's just normal
UI/UX thing. If you are interested, you can check out our [frontend repoitory](https://github.com/Fuzzy-Technical-Indicator/frontend).

## Experiments & Results
<figure>
<img src="https://i.imgur.com/0HBlxHW.png" loading="lazy" />
<figcaption>
<center>Variations of indicators we used.</center>
</figcaption>
</figure>

Now, let's see if our project actually work or nah. Wa are trying to show that 
when using technical indicators to trade, fuzzy logic can provide better result than using
fixed numbers like classical one. We have done the experiments on both stocks 
and crypto currency market but I'll only show the crypto currency one (because I think it's the most
interesting). So the setup will be like this
- Test on BTC, ETH, BNB with 1 hour time interval from 1 October 2023 to 8 March 2024 (uptrend).
- Start with 3000$ split among those 3 coins, result in 1000$ each.
- Minimum position size is 30$, normal position size is 5% of remaning capital if we can.
- Take profit at 20% and stop loss at 10%

We will also test our indicators on side way and downtrend market to check how is the result but this
will only be on ETH only for 3000$. We did the experimentations on 2 fuzzy technical indicators that we have created AROON-MACD and RSI-BB. 
So let's check it out

<br>

*B&H on the figures means Buy & Hold, it's how the market move.*

#### AROON-MACD
This is a kind of trend following indicator that use aroon to identify the trend and macd to find
the entry chance. We'll enter a new position if the signal is greater than 30. The classical variation
will be
```
if ((macd > 65.0 &&  macd< 85.0) || (macd > 35.0 || macd < 65.0)) 
    && aroon_up > 80.0:
    Enter Long

if ((macd > 15.0 && macd < 35.0) || (macd > 35.0 || macd < 65.0)) 
    && aroon_down > 80.0:
    Enter Short
```
I'll omit the details about the linguistic variables and fuzzy rules of fuzzy variations but the 
idea is simple, it's very similar to classical one but we are using fuzzy sets instead.

<figure>
<img src="https://i.imgur.com/5oml3PT.png" loading="lazy" />
<figcaption>
<center>AROON-MACD backtesting result on BTC, ETH, BNB while market is in uptrend.</center>
</figcaption>
</figure>

<figure>
<img src="https://i.imgur.com/K0Utm1u.png" loading="lazy" />
<figcaption>
<center>AROON-MACD backtest result on ETH while market is in downtrend.</center>
</figcaption>
</figure>

<figure>
<img src="https://i.imgur.com/JTHhxbE.png" loading="lazy" />
<figcaption>
<center>AROON-MACD backtest result on ETH while market is in sideway.</center>
</figcaption>
</figure>

#### RSI-BB
The idea of this indicator is mean reversion, by using rsi and bollinger band (bb) we can determine
when the price is too far from the mean and take advantage of it. We'll enter a new position if 
the signal is greater than 25 for this indicator. The classical variation will be
```
If rsi < 30 && bb < -80:
	Enter Long

If rsi > 70 && bb > 80:
	Enter Short
```
I'll omit the details about the linguistic variables and fuzzy rules of fuzzy variations for 
the same reason on AROON-MACD too.

<figure>
<img src="https://i.imgur.com/yu9KwuL.png" loading="lazy" />
<figcaption>
<center>RSI-BB backtesting result on BTC, ETH, BNB while market is in uptrend.</center>
</figcaption>
</figure>

<figure>
<img src="https://i.imgur.com/JKAmbae.png" loading="lazy" />
<figcaption>
<center>RSI-BB backtest result on ETH while market is in downtrend.</center>
</figcaption>
</figure>

<figure>
<img src="https://i.imgur.com/S0My2yz.png" loading="lazy" />
<figcaption>
<center>RSI-BB backtest result on ETH while market is in sideway.</center>
</figcaption>
</figure>

#### Short Analyis
From 6 figures of the backtesting result above, fuzzy variations perform much better 
than the classical variation on 3 figures and on the other 3 figures the result is not that much
difference (except RSI-BB on sideway). And the fuzzy variations are especially doing well on 
uptrend market as we can see on the result of both AROON-MACD and RSI-BB uptrend figures. Overall,
we can say that the fuzzy variations is better than the classical variation.

#### Remarks
There are many details on theexperimentations that I have omitted for the sake of keeping this 
blog as short as possible (and more into the technical stuffs). If you can read Thai 
(sadly, no English version) and want to check the full report you can check it out on 
this [report repository](https://github.com/Fuzzy-Technical-Indicator/report).

## Conclusion & More Ideas
The result from experimentations show that our fuzzy logic indicators perform better classical one
most of the times but PSO and liquid-f don't seems to significantly help. I think the reason why
fuzzy logic variations perform better is because of fuzzy logic capabilities to deal with 
vague and uncertain data. Instead of only 1 and 0 for classical one, our signal could have 
ranges of confident which is super helpful. I believe this tools/ideas will be helpful in trading
if you know what rules, linguistic varialbles to set up.

<br>

*I also actually try using this with real money, it actually help me get about 60$ profit. I think 
it could actually work.*

#### Further Developments
- We didn't separate development environment from production environment (we have only 1 mongoDB instance),
when we change the schema of some collections, the production is broken. 
Actually we could have local mongoDB instance for development.
- Maybe we could use GPU to do some tasks like backtesting or PSO.
- Add more markets such as SET, Nikkie, Forex etc.
- Use PSO or other computational intelligence e.g. genetic algorithm to modify our fuzzy technical 
indicator based on the data more. We could also trying to change fuzzy rules too.
- More money management strategy is always a good idea.
- More kind of linguistic variables such as risk level, social media sentimental, news sentimental,
ranking of the asset, story of the asset.

<br>

When doing this project, I've learned so many things about Rust, SvelteKit, web server, threading, 
PSO, Fuzzy Logic, and more which make me love this field even more. Lastly, thank you for my friend 
[Thanawat](https://github.com/0736b), my advisor [Sansanee](https://myweb.cmu.ac.th/sansanee.a/CV.htm) 
and everyone that have involved in this project.

## References
- [https://en.wikipedia.org/wiki/Fuzzy_set](https://en.wikipedia.org/wiki/Fuzzy_set)
- [https://www.sciencedirect.com/topics/engineering/linguistic-variable](https://www.sciencedirect.com/topics/engineering/linguistic-variable)

