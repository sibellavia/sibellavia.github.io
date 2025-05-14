---
title: "About Lemon"
date: "2025-05-02"
---

Lemon is the web server I’m working on in my spare time. Let’s say it’s become my side project and I’m using it as a lab for my personal experiments and ideas. It’s also giving me the chance to write my very first devlog.

**Foreword:** all devlogs related to the development of lemon will be written in a casual, random way. They’ll cover everything, but mostly I’ll share features that get introduced, bugs, curiosities… A lot of things will (almost always) be the product of my own ignorance.

But let’s get to it! Let’s talk about the tech stack.

---

## Tech Stack

* **Rust:** because I deeply love low‑level languages. My favorite is C. But for this project, I thought it’d be a great chance to learn Rust more thoroughly. So far, I’m enjoying it. The technical reasons are performance‑related. And also because there aren’t many stand‑alone web servers like Nginx or Caddy written in Rust.
* **Tokio:** de facto standard async runtime in the Rust ecosystem. We use its task scheduling, non‑blocking I/O primitives, and synchronization tools to build the server’s concurrent architecture.
* **Hyper:** I find it an excellent HTTP library. It didn’t make sense to rewrite it from scratch, and besides it works really well.
* **Rustls:** for TLS.
* **TOML/Serde:** for clear configuration.
* And then we have **Moka** for high‑performance caching and **async-compression** for Brotli/Zstd/Gzip.

There are other dependencies too, some of them are complementary. Spoiler: as I develop, I realize things I don’t like about Rust. One of those is the so‑called "dependency hell". In lemon, I’m trying to manage that factor as well as possible. I’ll try not to increase dependencies, and to write my own logic where I can.

---

## How the architecture has changed

I’m a big fan of software design. lemon will allow me to experiment with various ideas I have in mind. The core principle is and will remain **simplicity**. Also, one of my goals is to minimize user‑space copies.

Version 0.1 of lemon adopted a trivial solution, based on an implicit concurrency model dictated by Tokio. With version 0.2, I wanted to introduce a clearer architectural identity. The first option I considered was a model based on the idea of a *Core‑Sharded Reactor*, but it didn’t match the simplicity I was aiming for. So I looked for a compromise between quality, performance potential, and incremental improvement. The current vision is that of a **Shared Acceptor** complemented by a **Tokio Runtime Pool**.

The conceptual model thus consists of a single dedicated **Acceptor Thread**: inspired by Nginx’s *master process* concept (though in lemon it’s only a thread), the Acceptor is simply a separate OS thread that owns all configured listening sockets (e.g., `0.0.0.0:80`, `0.0.0.0:443`, etc.) and loops quickly and non‑blockingly on the `accept()` calls for those sockets.

Everything else from the TLS handshake, to HTTP parsing, all the way to executing handler logic—happens elsewhere: in Tokio’s multi‑threaded runtime pool. This isolates the latency‑critical part (`accept()`) from the "heavier" parts (TLS handshake, file I/O, proxying, etc.) and lets workers focus exclusively on handshake, parsing, handler execution, and sending the response, without having to worry about opening new sockets.

All the "acceptor thread" logic lives in `src/lib.rs`, inside the `start_services` function:

```rust
let acceptor = thread::Builder::new()
    .name("lemon-acceptor".into())
    .spawn(move || -> Result<()> {
        let acceptor_rt = tokio::runtime::Builder::new_current_thread()
            .enable_io()
            .build()?;
        acceptor_rt.block_on(async {
            for listener in listeners {
                loop {
                    match listener.accept().await {
                        Ok((socket, addr)) => {
                            tokio::spawn(handle_connection(socket));
                        }
                        Err(e) => error!("Accept error: {}", e),
                    }
                }
            }
        });
        Ok(())
    })?;
```

This way, the "acceptor" thread never does TLS handshakes or HTTP parsing: it simply takes new connections and hands them off very lightly to the worker pool running on the main Tokio multi‑threaded runtime.

Let’s look at the characteristics of this architecture, and why I chose it. First off, compared to the initial implicit model, here we have a clear separation of roles. It establishes a distinct boundary between accepting connections (Acceptor) and processing them (Worker Pool). This is a clear architectural pattern, easier to reason about than having accept calls potentially scattered across worker threads. It fully leverages Tokio’s battle‑tested, efficient work‑stealing scheduler for the complex task of connection processing. This lets me benefit from its optimizations without reinventing the wheel (for now). We also avoid complexity in these early iterations: no need for manual current_thread runtimes, CPU pinning, lock‑free queues, or complex backpressure logic between acceptor and workers. The handoff is simply `tokio::spawn`.

It seems like the best compromise between quality, performance, and development speed. Of course, future iterations will bring architectural changes and improvements. For now, this is sufficient for what lemon offers!

---

## What `lemon` offers

Let's talk about the concrete things now! What does lemon offer? 

Note that this refers to v0.2.3, which is the latest on GitHub.

First of all, lemon supports a clear, declarative config, which I will call `lemonConfig`. In a nutshell: TOML + `serde` for easy, human-readable server setup. I don't know if it is too "essential". I read some discussions on Twitter where users would like a more extendible configuration for such a web server, perhaps in Lua. I could do it, but now now.  

When lemon boots it looks for a single `lemon.toml` in the working directory. That file is the source of truth: every listener, cert, redirect, cache limit, log format... all in one human‑readable place. 

Design mantra: "simple cases stay simple, complex cases stay possible". Let's do a fast tour of the grammar:

```toml
# every server lives in its own table
[server.blog]

# networking is explicit
listen_addr = "0.0.0.0:443"

# TLS is pluggable: acme | manual | local_dev
# you can also avoid declaring it if you wish a plain http server
tls = { type = "acme", domains = ["blog.example.com"], contact = "mailto:admin@example.com" }

# handlers express what to do with each request
handler = { type = "static", www_root = "./public" }

# hardening tweaks are opt‑in but one‑liner
security = { frame_options = "SAMEORIGIN" }
```

When you save the file, lemon gets it and runs it through `serde` intro a strongly-typed `lemonConfig` struct hierarchy. A validation phase checks everything. Any violation is a compile‑grade error at runtime (lemon refuses to start). I chose TOML because hits the "sweet spot" between expressiveness, safety, and ergonomics. It's simple, and that's exactly what lemonConfig needs to be. But hey, in the future it could become something else :-)

lemonConfig can be as complete as you want. Let me show you a *full* example of what it could be:

```toml
# 🍋 lemonConfig
#
# This file demonstrates **every first‑class feature** the server knows today.
# Every stanza is optional except one [server.*] table and its `handler`.

###############################################################################
#  GLOBAL LOGGING
###############################################################################
[logging]
level  = "debug"                         # trace | debug | info | warn | error
format = "json"                          # text  | json
output = { type = "file", path = "./logs/lemon.log" }   # stdout | file { path }

###############################################################################
#  PRODUCTION STATIC SITE WITH ACME TLS
###############################################################################
[server.blog]
listen_addr = "0.0.0.0:443"

tls = {                                    # Automatic Let's Encrypt certificates
  type      = "acme",
  domains   = ["blog.example.com", "www.blog.example.com"],
  contact   = "mailto:ops@example.com",
  cache_dir = "./acme-cache",              # where certs are stored on disk
  staging   = false                        # flip to true to test against LE staging
}

handler = {                                # Optimised static file server
  type                         = "static",
  www_root                     = "./public",
  content_cache_max_file_bytes = 1_048_576,    # optional: 1 MiB per file
  content_cache_max_total_bytes = 536_870_912  # optional: 512 MiB total cache
}

security = {                               # HTTP hardening tweaks
  add_default_headers    = true,            # Server, X‑Content‑Type‑Options, etc.
  hsts_max_age           = 63_072_000,      # 2 years
  hsts_include_subdomains = true,
  hsts_preload           = true,
  frame_options          = "SAMEORIGIN"     # DENY | SAMEORIGIN | NONE
}

###############################################################################
#  ADMIN API REVERSE‑PROXY WITH MANUAL CERT
###############################################################################
[server.api]
listen_addr = "0.0.0.0:8443"

tls = {                                    # bring‑your‑own PEM pair
  type              = "manual",
  certificate_file  = "./certs/api.crt",
  key_file          = "./certs/api.key"
}

handler = { type = "reverse_proxy", target_url = "http://127.0.0.1:3000" }

security = {                               # tighter framing for admin
  add_default_headers = true,
  hsts_max_age        = 31_536_000,        # 1 year
  frame_options       = "DENY"
}

###############################################################################
#  INTERNAL HEALTH CHECK ENDPOINT (NO TLS)
###############################################################################
[server.internal_health]
listen_addr = "127.0.0.1:8081"
handler     = { type = "health_check" }

# minimal hardening
security = { add_default_headers = false }

###############################################################################
#  HTTP‑>HTTPS REDIRECTOR
###############################################################################
[server.redirector]
listen_addr = "0.0.0.0:80"
handler     = { type = "redirect_https", target_base = "https://blog.example.com" }
security    = { add_default_headers = false }   # no body, so no headers needed

###############################################################################
#  LOCAL DEV SERVER WITH SELF‑SIGNED CERT
###############################################################################
[server.localdev]
listen_addr = "127.0.0.1:3443"

tls     = { type = "local_dev" }           # generates a throw‑away cert on boot
handler = { type = "static", www_root = "./sandbox" }
security = { frame_options = "SAMEORIGIN" }
```

Generally speaking, what do we have? Automatic negotiation of HTTP/1.1 or HTTP/2 based on client capabilities (via ALPN for HTTPS connections) and automatic HTTPS. lemon offers a way to achieve automatic HTTPS for offline or local development scenarios. You can configure a server block with `tls = { type = "local_dev" }`. The `generate_local_dev_tls` function in `src/server.rs` implements this: lemon automatically generates a temporary, self-signed TLS certificate using the `rcgen` crate upon starting. This certificate includes SANs for `localhost` and `127.0.0.1`. This process doesn't require any internet connection, making it suitable for offline development and testing.

Talking about what the server can do, effectively: lemon is designed to be modular, and currently the existing modules (defined in the code as `handlers`) are static file serving and an initial reverse proxy support. Not only! We also have minor handlers like a `health_check` endpoint and a HTTP->HTTPS redirect. I’ll be adding more modules over time, but the current focus is on stabilizing and optimizing the ones that already exist.

## That's it for now

I'm not a fan of long blogposts. I have tried to make a very concentrated summary of what is lemon for now, the choices I have made, and some reasons why I have adopted certain solutions. There are so many other things I can share, so this is an introductory overview for today!

