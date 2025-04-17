---
title: "Documentation"
---

# Documentation

## 1. Overview

Lemon is a general-purpose web server written in Rust. It leverages asynchronous I/O with [Tokio](https://github.com/tokio-rs/tokio), [Hyper](https://github.com/hyperium/hyper) HTTP library, and [Rustls](https://github.com/rustls/rustls) for TLS support. The primary design goals are simplicity, efficiency, and ease of configuration.

## 2. Features

*   **HTTP/1 and HTTP/2 Support:** automatically negotiates HTTP/1.1 or HTTP/2 based on client capabilities (ALPN for HTTPS).
*   **Automatic HTTPS (ACME):** built-in integration with Let's Encrypt via `rustls-acme` for automatic TLS certificate acquisition and renewal.
*   **Lemon Configuration:** uses a clear and human-readable `lemon.toml` file for defining server instances and their behavior.
*   **Modular Design:** core server logic, configuration, TLS management, and request handling are separated into distinct modules.

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

Lemon uses a TOML file named `lemon.toml` located in the working directory where the server runs. This file defines one or more server instances, each with its own listening address, optional TLS settings, and request handler.

**Principles:**

1.  **Explicitness:** required settings are explicit.
2.  **Separation of concerns:** listening (address/port), security (TLS), and functionality (handlers) are distinct configuration sections.
3.  **Simple Cases = Simple Config:** basic HTTP/S servers require minimal boilerplate.
4.  **Discoverability:** structure and naming should guide the user.

### 4.1. Overall Structure

The configuration file consists of one or more `[server.<name>]` tables. Each table defines a distinct server instance. The `<name>` (e.g., `main_site`, `api_proxy`) is chosen by the user and serves as an identifier in logs.

```toml
# Example structure with multiple server instances

[server.main_site]
# Configuration for the 'main_site' HTTPS server...
listen_addr = "0.0.0.0:443"
tls = { type = "acme", domains = ["example.com"], contact = "mailto:admin@example.com" }
handler = { type = "static", www_root = "/var/www/html/main_site" }

[server.http_redirector]
# Configuration for an HTTP redirector server...
listen_addr = "0.0.0.0:80"
# No tls = HTTP
handler = { type = "redirect_https", target_base = "https://example.com" } # Planned handler
```

At least one `[server.<name>]` block is required.

*(optional global settings for logging or timeouts might be introduced later.)*

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

Automatically configures TLS (HTTPS) for the server instance. If this section is omitted, the server will operate over plain HTTP.

*   **Type:** Table
*   **Structure:** Contains a mandatory `type` field and type-specific options.

**Implemented TLS type:**

*   **`type = "acme"`:** Enables automatic certificate management using ACME (Let's Encrypt).
    *   `domains` (Required): An array of strings listing the domain names this certificate should cover.
    *   `contact` (Required): A string specifying the contact email address for the Let's Encrypt account, prefixed with `mailto:`.
    *   `cache_dir` (Optional): A string specifying the path to a directory for storing ACME state.
        *   **Default:** `"./acme-cache"`
    *   `staging` (Optional): A boolean indicating whether to use the Let's Encrypt staging environment (`true`) or production (`false`). Recommended for testing.
        *   **Default:** `false` (Production)
    *   **Validation:** `domains` must not be empty. `contact` must start with `mailto:`. `cache_dir` must not be empty if specified.

```toml
[server.secure_site]
listen_addr = "0.0.0.0:443"
tls = { type = "acme", domains = ["example.com", "www.example.com"], contact = "mailto:admin@example.com", cache_dir = "/var/cache/lemon/acme", staging = true }
handler = { type = "static", www_root = "/var/www/secure" }
```

*Planned TLS types (will come in the future):*

*   **`type = "manual"`:** Use user-provided certificate files.
    *   `certificate_file` (Required): Path to the certificate chain file (PEM format).
    *   `key_file` (Required): Path to the private key file (PEM format).
*   **`type = "local_dev"`:** Automatically generates a self-signed certificate for local development (e.g., `localhost`, `127.0.0.1`). Requires no additional parameters. Ideal for easy local HTTPS testing.

```toml
# Planned: Manual TLS example
# [server.manual_tls]
# listen_addr = "0.0.0.0:443"
# tls = { type = "manual", certificate_file = "/path/to/cert.pem", key_file = "/path/to/key.pem" }
# handler = { type = "static", www_root = "/var/www/manual" }

# Planned: Local Dev TLS example
# [server.dev_server]
# listen_addr = "127.0.0.1:8443"
# tls = { type = "local_dev" }
# handler = { type = "reverse_proxy", target_url = "http://localhost:3000" }
```

#### `handler` (Required)

Defines how the server instance should process incoming requests.

*   **Type:** Table
*   **Structure:** Contains a mandatory `type` field and type-specific options.

**Implemented handler types:**

*   **`type = "static"`:** Serves static files from a directory.
    *   `www_root` (Required): Path to the root directory containing the static files.
    *   **Validation:** `www_root` must not be empty. Directory should exist and be readable.

    ```toml
    [server.static_server]
    listen_addr = "0.0.0.0:8080"
    handler = { type = "static", www_root = "./public_html" }
    ```

*   **`type = "reverse_proxy"`:** Forwards incoming requests to a specified backend URL.
    *   `target_url` (Required): The base URL of the backend service. (Note: Renamed from `upstream` in some discussions for clarity in docs).
    *   **Validation:** `target_url` must not be empty and must be a parseable URL.

    ```toml
    [server.api_proxy]
    listen_addr = "127.0.0.1:9000"
    handler = { type = "reverse_proxy", target_url = "http://localhost:5000/api" }
    ```

*   **`type = "healthcheck"`:** Provides a simple health check endpoint. Responds with `200 OK` and "Healthy" body to `GET /`. Accepts no additional configuration parameters.

    ```toml
    [server.health]
    listen_addr = "127.0.0.1:9999"
    handler = { type = "healthcheck" }
    ```

**Planned handler types:**

*   **`type = "redirect_https"`:** Redirects incoming HTTP requests to the corresponding HTTPS URL.
    *   `target_base` (Required): The base HTTPS URL (e.g., `"https://example.com"`). Preserves the request path and query parameters.

    ```toml
    # Planned: HTTP to HTTPS redirector
    # [server.http_redirect]
    # listen_addr = "0.0.0.0:80"
    # handler = { type = "redirect_https", target_base = "https://your-domain.com" }
    ```

*(more handlers like API gateways, WebSocket proxies, etc., will be added by extending this structure).*

### 4.3. Configuration Examples

#### Simple HTTP Static Server

```toml
[server.my_http_site]
listen_addr = "0.0.0.0:8080"
handler = { type = "static", www_root = "./public" }
```

#### Simple ACME HTTPS Static Server

```toml
[server.my_https_site]
listen_addr = "0.0.0.0:443"
# cache_dir will default to ./acme-cache, staging defaults to false
tls = { type = "acme", domains = ["mydomain.com"], contact = "mailto:me@mydomain.com" }
handler = { type = "static", www_root = "./public" }
```

#### ACME Server with Explicit Cache & Staging

```toml
[server.my_other_https_site]
listen_addr = "[::]:443" # IPv6 example
tls = { type = "acme", domains = ["other.net"], contact = "mailto:admin@other.net", cache_dir = "/var/lib/lemon/acme", staging = true }
handler = { type = "static", www_root = "/srv/www/other" }
```

#### Planned: Local Dev HTTPS Proxy

```toml
# [server.local_proxy]
# listen_addr = "127.0.0.1:8443"
# tls = { type = "local_dev" }
# handler = { type = "reverse_proxy", target_url = "http://127.0.0.1:3000" } # Proxy to local dev server
```

#### Implicit HTTP Challenge Server (ACME)

Lemon automatically handles ACME HTTP-01 challenges. If you configure a server instance using `tls = { type = "acme", ... }` and do *not* explicitly define another `[server.*]` block listening on port 80 for the same IP address range (e.g., `0.0.0.0:80` or `[::]:80`), Lemon will implicitly start a minimal HTTP server on port 80 solely to handle these challenges.

If you need to run your own service on port 80 (e.g., for HTTP->HTTPS redirects or serving different content), you **must** define an explicit `[server.<name>]` block for port 80. The ACME challenge handling will be integrated into this explicit server if it also handles the relevant domains.

```toml
# Example: Explicit HTTP server alongside ACME HTTPS server
# (This prevents the implicit challenge server from starting)

# [server.main_https]
# listen_addr = "0.0.0.0:443"
# tls = { type = "acme", domains = ["your-domain.com"], contact = "mailto:webmaster@your-domain.com" }
# handler = { type = "static", www_root = "/var/www/your-domain.com" }

# [server.main_http]
# listen_addr = "0.0.0.0:80"
# # Planned: Redirect all HTTP to HTTPS
# handler = { type = "redirect_https", target_base = "https://your-domain.com" }
```

## 5. Core Handler Modules

This section provides a brief overview of the primary request handlers currently implemented in Lemon.

### 5.1. Static File Serving (`src/handlers/static_files.rs`)

This handler provides efficient and standards-compliant serving of static files from a local directory (`www_root`).

*   **Features:**
    *   Serves files for `GET` and `HEAD` requests.
    *   Automatically serves `index.html` when a directory is requested.
    *   Uses an in-memory cache (`moka`) for file metadata (size, modification time, content type) to reduce disk I/O.
    *   Generates `ETag` headers based on file size and modification time.
    *   Supports conditional requests using the `If-None-Match` header, returning `304 Not Modified` responses when appropriate.
    *   Sets `Content-Type` (using MIME guessing), `Content-Length`, and `Last-Modified` headers.
    *   Streams file content asynchronously.

### 5.2. Reverse Proxy (`src/handlers/reverse_proxy.rs`)

This handler provides basic reverse proxy functionality, forwarding requests to a single backend service.

*   **Features:**
    *   Forwards requests to a configured HTTP `target_url`.
    *   Rewrites the request URI and `Host` header to match the target.
    *   Returns `502 Bad Gateway` if the backend request fails.
*   **Current State & Limitations:**
    *   **Very Basic:** This is an early implementation suitable for simple use cases.
    *   **No Streaming:** It reads the *entire* request and response bodies into memory before forwarding/returning them. This is inefficient and unsuitable for large requests/responses (e.g., file uploads/downloads).
    *   **HTTP Only:** Currently only supports proxying to HTTP backends (not HTTPS).
    *   Lacks advanced features like load balancing, health checks, WebSocket support, custom header manipulation (e.g., `X-Forwarded-*`), or request/response modification.
*   **Use Case:** Simple API forwarding, routing requests to a backend application running on a different port or host (for small request/response sizes).

### 5.3. ACME Challenge & HTTPS Redirect (`src/handlers/acme.rs`)

This specialized handler (`AcmeRedirectHandler`) is designed to run on an HTTP server (typically port 80) when ACME (Let's Encrypt) is used to manage certificates for HTTPS servers.

*   **Features:**
    *   **ACME HTTP-01 Challenge Handling:** Intercepts requests to `/.well-known/acme-challenge/{token}` and responds with the required key authorization provided by the `rustls-acme` library's resolver state. This is necessary for Let's Encrypt to validate domain ownership.
    *   **HTTP-to-HTTPS Redirection:** For all other requests, it issues a `301 Permanent Redirect` to the equivalent HTTPS URL. It determines the target hostname using the request's `Host` header and comparing it against the list of domains configured for ACME, ensuring users are directed to the secure site.
*   **Use Case:** Primarily used by the implicit HTTP server Lemon starts on port 80 when ACME TLS is configured and no explicit server is defined for port 80. It can also be configured explicitly for an HTTP server if needed.