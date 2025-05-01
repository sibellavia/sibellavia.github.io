---
title: "lemon"
---

`lemon` is a general-purpose web server with a clear, human-readable configuration. It effortlessly supports both HTTP/1.1 and HTTP/2, automated HTTPS provisioning, and versatile request handling.

`lemon` is under development, and it will be for a long time. Enjoy!

## Benchmarks

*Tested on Hetzner CX22 (2 vCPU, 4 GB RAM), full HTTPS, serving static index.html ("lemon is running").*
 
*Tool used: `bombardier`.*

| Scenario                         | Conns | Requests | Avg RPS | Max RPS | Avg Latency | Max Latency | Errors |
|----------------------------------|--------|----------|---------|---------|-------------|--------------|--------|
| Light Load (burst)              | 100    | 10,000   | 1,766   | 3,544   | 56.36 ms    | 210.72 ms   | 0      |
| Medium Load                     | 500    | 10,000   | 5,807   | 15,132  | 85.75 ms    | 824.51 ms   | 0      |
| Medium Load (larger sample)     | 500    | 20,000   | 6,436   | 30,791  | 78.07 ms    | 671.23 ms   | 0      |
| Medium-Heavy (extended run)     | 500    | 50,000   | 7,744   | 23,754  | 64.74 ms    | 578.17 ms   | 0      |
| High Load                       | 1000   | 20,000   | 5,507   | 19,821  | 156.93 ms   | 1.80 s      | 0      |
| High Load (repeat run)          | 1000   | 20,000   | 5,563   | 24,042  | 169.09 ms   | 2.28 s      | 0      |
| Sustained Load (60s)            | 100    | 109,116  | 1,819   | 4,661   | 55.01 ms    | 266.86 ms   | 0      |

- Up to 7,744 RPS, for now :-)
- 100% successful responses (no 5xx errors)
- Smooth performance scaling from 100 to 1000 concurrent clients
- Tested with full TLS

## License

[LICENSE](https://github.com/sibellavia/lemon/blob/main/LICENSE)