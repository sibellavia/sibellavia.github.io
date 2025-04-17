---
title: "lemon"
---

Lemon is a general-purpose web server written in Rust. It leverages asynchronous I/O with [Tokio](https://github.com/tokio-rs/tokio), [Hyper](https://github.com/hyperium/hyper) HTTP library, and [Rustls](https://github.com/rustls/rustls) for TLS support. The primary design goals are simplicity, efficiency, and ease of configuration.

Lemon is under development, and it will be for a long time. Enjoy us on our journey.

Lemon is Simone Bellavia's side project. 

## Benchmarks

*Tested on Hetzner CX22 (2 vCPU, 4 GB RAM), Automatic HTTPS, serving static index.html ("lemon is running"). Tool used: `bombardier`.*

| Scenario                  | RPS (avg) | Max RPS | Avg Latency | Max Latency | Errors |
|---------------------------|-----------|---------|-------------|-------------|--------|
| 100 connections, 10k reqs | 1,023     | 2,339   | 97 ms       | 418 ms       | 0      |
| 500 connections, 10k reqs | 3,769     | 10,365  | 123 ms      | 970 ms       | 0      |
| 100 connections, 60s run  | 1,046     | 3,093   | 95 ms       | 312 ms       | 0      |

## License

[LICENSE](https://github.com/sibellavia/lemon/blob/main/LICENSE)