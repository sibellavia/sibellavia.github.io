---
title: "lemon"
---

Lemon is a general-purpose web server written in Rust. It leverages asynchronous I/O with [Tokio](https://github.com/tokio-rs/tokio), [Hyper](https://github.com/hyperium/hyper) HTTP library, and [Rustls](https://github.com/rustls/rustls) for TLS support. The primary design goals are simplicity, efficiency, and ease of configuration.

Lemon is under development, and it will be for a long time. Enjoy us on our journey.

Lemon is Simone Bellavia's side project. 

## Benchmarks

*Tested on Hetzner CX22 (2 vCPU, 4 GB RAM), full HTTPS, serving static index.html ("lemon is running").*
 
*Tool used: `bombardier`.*

| Scenario                  | RPS (avg) | Max RPS | Avg Latency | Max Latency | Errors |
|---------------------------|-----------|---------|-------------|-------------|--------|
| 100 connections, 10k reqs | 1,100     | 5,414   | 91 ms       | 368 ms       | 0      |
| 500 connections, 10k reqs | 3,769     | 19,748  | 143 ms      | 651 ms       | 0      |
| 500 connections, 20k reqs | 4,053     | 20,857  | 125 ms      | 640 ms       | 0      |
| 1000 connections, 20k reqs | 4,583    | 18,632  | 210 ms      | 1.63 s       | 0      |
| 100 connections, 60s run  | 1,046     | 3,093   | 95 ms       | 312 ms       | 0      |

## License

[LICENSE](https://github.com/sibellavia/lemon/blob/main/LICENSE)