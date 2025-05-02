---
title: "lemon"
---

`lemon` is a general-purpose web server with a clear, human-readable configuration. It effortlessly supports both HTTP/1.1 and HTTP/2, automated HTTPS provisioning, and versatile request handling.

`lemon` is under development, and it will be for a long time. Enjoy!

## Benchmarks

Benchmarked with [bombardier](https://github.com/codesenberg/bombardier) over HTTPS (no staging). Hosted on Hetzner CX22 (2 vCPU, 4 GB RAM). Tested from MacBook Pro M1 (Italy) to Germany.

| Scenario                         | Conns | Requests | Avg RPS | Max RPS | Avg Latency | Max Latency | Errors | Throughput  |
|----------------------------------|--------|----------|---------|---------|-------------|--------------|--------|--------------|
| Light Load (burst)              | 100    | 10,000   | 1,614   | 2,542   | 61.49 ms    | 373.30 ms   | 0      | 3.07 MB/s    |
| Medium Load                     | 500    | 10,000   | 5,729   | 43,478  | 91.03 ms    | 884.00 ms   | 0      | 10.62 MB/s   |
| Medium Load (larger sample)     | 500    | 50,000   | 6,963   | 33,009  | 73.09 ms    | 854.00 ms   | 0      | 12.94 MB/s   |
| High Load                       | 1000   | 20,000   | 3,444   | 24,365  | 206.29 ms   | 2.24 s      | 19 TLS handshake timeouts | 6.65 MB/s    |
| Sustained Load (60s test)       | 100    | 101,178  | 1,686   | 3,306   | 59.33 ms    | 333.29 ms   | 0      | 3.16 MB/s    |

## License

[LICENSE](https://github.com/sibellavia/lemon/blob/main/LICENSE)