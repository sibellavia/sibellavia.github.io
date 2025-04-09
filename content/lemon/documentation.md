---
title: "Documentation"
---

# Documentation

## 1. Overview

Lemon is a modern, general-purpose web server written in Rust. It leverages asynchronous I/O with [Tokio](https://github.com/tokio-rs/tokio), [Hyper](https://github.com/hyperium/hyper) HTTP library, and [Rustls](https://github.com/rustls/rustls) for TLS support. The primary design goals are simplicity, efficiency, and ease of configuration.

## 2. Features

*   **HTTP/1 & HTTP/2 Support:** Automatically negotiates HTTP/1.1 or HTTP/2 based on client capabilities (ALPN for HTTPS).
*   **HTTPS via Rustls:** Secure connections using modern TLS protocols and ciphersuites.
*   **Automatic HTTPS (ACME):** Built-in integration with Let's Encrypt via `rustls-acme` for automatic TLS certificate acquisition and renewal.
*   **Configurable Handlers:**
    *   **Static File Serving:** Serves static content from a specified directory.
    *   **Reverse Proxy:** Forwards requests to backend services.
    *   **Health Check:** Provides a simple health check endpoint.
    *   *(Extensible design for future handlers like API gateways, WebSocket proxies, etc.)*
*   **TOML Configuration:** Uses a clear and human-readable `lemon.toml` file for defining server instances and their behavior.
*   **Asynchronous:** Built entirely on the Tokio async runtime.
*   **Modular Design:** Core server logic, configuration, TLS management, and request handling are separated into distinct modules.

## 3. Getting Started

### Prerequisites

*   Rust Toolchain ([https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install))

### Building

```bash
git clone https://github.com/sibellavia/lemon.git
cd lemon
cargo build --release
```

### Running

1.  Create a `lemon.toml` configuration file (see Section 4).
2.  Run the compiled binary:

    ```bash
    ./target/release/lemon
    ```

The server will start based on the configuration in `lemon.toml`. Logs will be printed to standard output.

## 4. Lemon Configuration (`lemon.toml`)

Lemon uses a TOML file named `lemon.toml` located in the working directory where the server is run. This file defines one or more server instances, each with its own listening address, optional TLS settings, and request handler.

### 4.1. Overall Structure

The configuration file consists of one or more `[server.<name>]` tables. Each table defines a distinct server instance. The `<name>` (e.g., `main_site`, `api_proxy`) is chosen by the user and serves as an identifier in logs and potentially for future management features.

```toml
# Example structure with two server instances

[server.main_site]
# Configuration for the 'main_site' server...
listen_addr = "0.0.0.0:443"
tls = { ... }
handler = { ... }

[server.internal_api]
# Configuration for the 'internal_api' server...
listen_addr = "127.0.0.1:8080"
# No tls = HTTP
handler = { ... }
```

At least one `[server.<name>]` block is required.

### 4.2. Server Block Options

Each `[server.<name>]` block requires `listen_addr` and `handler`, and optionally accepts `tls`.

#### `listen_addr` (Required)

Specifies the IP address and port the server instance should bind to.

*   **Type:** String
*   **Format:** `"IP_ADDRESS:PORT"` (e.g., `"0.0.0.0:443"`, `"127.0.0.1:8080"`, `"[::]:80"` for IPv6)
*   **Validation:** Must be a valid socket address parseable by Rust's `SocketAddr`.

```toml
[server.example]
listen_addr = "0.0.0.0:80"
handler = { type = "healthcheck" }
```

#### `tls` (Optional)

Configures TLS (HTTPS) for the server instance. If this section is omitted, the server will operate over plain HTTP.

*   **Type:** Table
*   **Structure:** Contains a mandatory `type` field and type-specific options.

Currently implemented TLS type:

*   **`type = "acme"`:** Enables automatic certificate management using ACME (Let's Encrypt).
    *   `domains` (Required): An array of strings listing the domain names this certificate should cover. The first domain is typically considered the primary common name.
    *   `contact` (Required): A string specifying the contact email address for the Let's Encrypt account, prefixed with `mailto:`.
    *   `cache_dir` (Optional): A string specifying the path to a directory where ACME state (account keys, certificates) should be stored. Must be writable by the Lemon server process.
        *   **Default:** `"./acme-cache"`
    *   `staging` (Optional): A boolean indicating whether to use the Let's Encrypt staging environment (`true`) or the production environment (`false`). Staging is recommended for testing to avoid rate limits.
        *   **Default:** `false` (Production)
    *   **Validation:** `domains` must not be empty. `contact` must start with `mailto:`. `cache_dir` must not be empty if specified.

```toml
[server.secure_site]
listen_addr = "0.0.0.0:443"
tls = { type = "acme", domains = ["example.com", "www.example.com"], contact = "mailto:admin@example.com", staging = true }
handler = { type = "static", www_root = "/var/www/secure" }
```

*(Future TLS types like `manual` for user-provided certificates and `local_dev` for self-signed certificates are planned but not yet implemented).*

#### `handler` (Required)

Defines how the server instance should process incoming requests.

*   **Type:** Table
*   **Structure:** Contains a mandatory `type` field and type-specific options.

Currently implemented handler types:

*   **`type = "static"`:** Serves static files from a directory.
    *   `www_root` (Required): A string specifying the path to the root directory containing the static files.
    *   **Validation:** `www_root` must not be empty. The directory should exist and be readable by the Lemon server process.

    ```toml
    [server.static_server]
    listen_addr = "0.0.0.0:8080"
    handler = { type = "static", www_root = "./public_html" }
    ```

*   **`type = "reverse_proxy"`:** Forwards incoming requests to a specified backend URL.
    *   `target_url` (Required): A string containing the base URL of the backend service to proxy requests to.
    *   **Validation:** `target_url` must not be empty and must be a parseable URL.

    ```toml
    [server.api_proxy]
    listen_addr = "127.0.0.1:9000"
    handler = { type = "reverse_proxy", target_url = "http://localhost:5000/api" }
    ```

*   **`type = "healthcheck"`:** Provides a simple health check endpoint. Responds with `200 OK` and a "Healthy" body to `GET /`. Accepts no additional configuration parameters.

    ```toml
    [server.health]
    listen_addr = "127.0.0.1:9999"
    handler = { type = "healthcheck" }
    ```

*(Future handler types like `redirect_https`, `api_gateway`, etc., are planned but not yet implemented).*

### 4.3. Configuration Examples

See `lemon_example.toml` for more detailed examples, including setting up an ACME-powered HTTPS server alongside an HTTP server (potentially for ACME challenges or redirects).

```toml
# lemon.toml: Common Scenario - HTTPS Site + HTTP Challenge/Redirect

# --- ACME HTTPS Server for the main site ---
[server.main_site]
listen_addr = "0.0.0.0:443"
# Use ACME for TLS
tls = { type = "acme", domains = ["your-domain.com"], contact = "mailto:webmaster@your-domain.com", staging = false }
# Serve static files
handler = { type = "static", www_root = "/var/www/your-domain.com" }

# --- Implicit HTTP Server for ACME Challenges ---
# Lemon automatically starts an HTTP server on port 80 if:
# 1. ACME TLS is configured for any server.
# 2. No explicit [server.*] block is defined listening on port 80.
# This implicit server handles the Let's Encrypt HTTP-01 challenge.
# It may also redirect HTTP traffic to HTTPS in the future.
# If you need fine-grained control over port 80 (e.g., serving different content),
# define an explicit [server.http_server] block:

# [server.explicit_http]
# listen_addr = "0.0.0.0:80"
# # Example: Redirect all HTTP to HTTPS (NOTE: redirect_https handler not yet implemented)
# # handler = { type = "redirect_https", target_base = "https://your-domain.com" }
# # Or serve different static content:
# handler = { type = "static", www_root = "/var/www/http_content" }
```

## 5. Architecture & Core Components

Lemon follows a modular structure found within the `src/` directory:

*   **`main.rs`:** The entry point of the application.
    *   Sets up logging and graceful shutdown signals.
    *   Loads and validates the `lemon.toml` configuration using `config.rs`.
    *   Initializes ACME state using `tls.rs` if required by the configuration.
    *   Iterates through the configured servers and spawns asynchronous tasks for each using `server.rs`.
    *   Manages the startup of an implicit HTTP challenge server if ACME is used but no explicit port 80 server is defined.
    *   Waits for the shutdown signal and coordinates the graceful shutdown process.
*   **`config.rs`:** Defines the Rust structs (`LemonConfig`, `ServerConfig`, `TlsConfig`, `HandlerConfig`, etc.) that map directly to the `lemon.toml` file structure.
    *   Uses `serde` for deserializing the TOML file.
    *   Contains the `load_and_validate_config` function, which reads, parses, and performs validation checks on the configuration.
*   **`server.rs`:** Handles the core server logic of listening for connections and processing them.
    *   Uses `tokio::net::TcpListener` to bind to the specified addresses.
    *   Manages TLS handshakes using `tokio_rustls` and the `TlsAcceptor` provided by `tls.rs` (for ACME) or potentially other TLS configurations in the future.
    *   Uses `hyper` and `hyper-util` to handle the HTTP protocol (HTTP/1 and HTTP/2).
    *   Defines a generic server loop (`run_server_loop`) and connection handling logic.
    *   For each incoming connection, it determines the appropriate handler (via `handlers::create_handler`) based on the server's configuration and passes the request to the handler's `handle` method.
    *   Implements graceful shutdown logic for active connections.
*   **`handlers/` (Module):** Defines the request handling logic.
    *   `mod.rs`: Defines the `Handler` trait that all request handlers must implement. Contains the `create_handler` factory function, which takes a `HandlerConfig` and returns the corresponding concrete `SharedHandler` (an `Arc<dyn Handler>`).
    *   `static_files.rs`: Implements the `StaticFileHandler` for serving files. Includes logic for mapping request paths to file system paths, handling different HTTP methods (GET, HEAD), setting MIME types, and caching metadata.
    *   `reverse_proxy.rs`: Implements the `ReverseProxyHandler`. Forwards requests to the configured `target_url`, copying relevant headers and the request body. Handles response streaming back to the client.
    *   `health.rs`: Implements the `HealthCheckHandler`. Provides a simple `/` endpoint returning 200 OK.
    *   `acme.rs`: Implements the `AcmeRedirectHandler` used by the implicit HTTP challenge server. Handles ACME challenge requests forwarded by `rustls-acme` and may optionally redirect other HTTP requests to HTTPS.
*   **`tls.rs`:** Manages TLS configuration and state, particularly for ACME.
    *   Uses `rustls-acme` to interact with Let's Encrypt.
    *   Initializes the `AcmeState` based on all `TlsConfig::Acme` blocks found in the configuration.
    *   Creates the `rustls::ServerConfig` and the `TlsAcceptor` needed by `server.rs` for handling HTTPS connections with ACME certificates.
*   **`shutdown.rs`:** Implements graceful shutdown logic for the entire application.
    *   Listens for OS signals (like Ctrl+C).
    *   Uses Tokio's `watch` channel to broadcast the shutdown signal to all server tasks and connection handlers.
    *   Waits for server tasks to complete within a timeout period.
*   **`logging.rs`:** Configures application-wide logging using the `tracing` and `tracing-subscriber` crates.
*   **`common.rs`:** Contains shared utilities, type aliases (like `BoxedBody`), and helper functions used across different modules.

## 6. Extensibility

Lemon is designed to be extensible:

*   **New Handlers:** Add a new variant to the `HandlerConfig` enum in `config.rs`, create a corresponding struct implementing the `Handler` trait in `src/handlers/`, and update the `create_handler` factory function in `src/handlers/mod.rs`.
*   **New TLS Types:** Add a new variant to the `TlsConfig` enum in `config.rs` and update the TLS initialization logic in `tls.rs` and `server.rs` to handle the new configuration.

Refer to `LEMON_CONFIG.md` for discussions on potential future handler types and configuration enhancements. 