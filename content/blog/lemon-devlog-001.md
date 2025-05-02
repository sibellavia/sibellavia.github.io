---
title: "Lemon Devlog 001"
date: "2025-05-01"
---

Eccoci per il primo Devlog di lemon 🍋. Lemon è il web server a cui mi sto dedicando nel tempo libero. Diciamo che è diventato il mio side-project e che sto utilizzando come laboratorio per i miei esperimenti personali e per le mie idee. Mi sta dando inoltre l'opportunità di scrivere il mio primo devlog.

Premessa: tutti i devlogs afferenti allo sviluppo di lemon saranno scritti in modo casuale e randomico. Copriranno di tutto, ma principalmente mi dedicherò a condividere funzionalità che verranno introdotte, bug, curiosità, ... Molte cose saranno (quasi sempre) prodotto della mia ignoranza. 

Ma veniamo al dunque! Parliamo dello stack tecnologico.

## Tech Stack

- Rust: Perché amo profondamente i linguaggi low-level: il mio preferito è C. Ma per questo progetto, ho pensato che potesse essere una buona occasione per imparare meglio Rust e approfondirlo. Fino ad ora mi sta piacendo. Le ragioni tecniche sono relative alle performances. E anche perché non esistono molti stand-alone web server come Nginx o Caddy.
- Tokio: De facto standard async runtime in the Rust ecosystem. We utilize its task scheduling, non-blocking I/O primitives, and synchronization tools to build the server's concurrent architecture.
- Hyper: La trovo un'ottima libreria HTTP. Non mi sembrava il caso di riscriverla da zero. E poi funziona molto bene.
- Rustls: Per il TLS.
- TOML/Serde: Clear configuration.
- E poi abbiamo Moka per high-performance caching e async-compression per Brotli/Zstd/Gzip. 

Ci sono anche altre dipendenze. Alcune sono complementari. Lo anticipo: man mano che sviluppo mi rendo conto delle cose che non mi piacciono di Rust. Una di queste è la cosiddetta "dependency hell". In lemon, sto cercando di gestire questo fattore quanto meglio possibile. Cercherò di non aumentare le dipendenze, e di scrivere le mie logiche ove possibile. 

## Come l'architettura è cambiata

Sono un grande amante del design del software. Lemon mi permetterà di sperimentare varie idee che ho in mente. Il principio cardine è e sarà la semplicità. Inoltre, uno dei miei obiettivi è anche quello di minimizzare le copie user-space. 

La versione 0.1 di lemon adottava una soluzione banale, basata su un modello implicito di concorrenza dettato da Tokio. Con la versione 0.2, ho voluto introdurre un'identità architetturale più chiara. La prima opzione a cui avevo pensato era il classico *Core-Sharded Reactor*, ma non rispecchiava la semplicità a cui ambivo. Quindi ho ricercato un compromesso fra qualità, potenziale di performance e miglioramento incrementale. L'attuale visione è quella di uno Shared Acceptor completato da un Tokio Runtime Pool. 

Il modello concettuale è quindi composto da un singolo, dedicato Acceptor Thread: ispirato al concetto di *master process* di Nginx (anche se in lemon è solo un thread), la sua sola responsabilità è quella di possedere tutti i listening socket e di runnare in maniera efficiente `accept` loop. Non performa le logiche dell'applicazione né i TLS handshakes.

Al suo fianco, a standard Tokio Multi-Threaded Runtime Pool: This is Tokio's default, highly optimized, work-stealing runtime. It handles all connection processing, including TLS handshakes, HTTP parsing (Hyper), request routing, and executing Lemon's handlers.

Veniamo alle caratteristiche di tale architettura, e le motivazioni per le quali l'ho scelta. Innanzitutto, rispetto al modello implicito iniziale, qui abbiamo una separazione chiara dei ruoli. Establishes a distinct boundary between accepting connections (Acceptor) and processing them (Worker Pool). This is a clear architectural pattern, easier to reason about than having accept calls potentially scattered across worker threads.

Fully utilizes the battle-tested, efficient work-stealing scheduler of Tokio's default runtime for the complex task of connection processing. Questo mi permette di beneficiare delle sue ottimizzazioni senza dover necessariamente reinventare la ruota (per adesso). 

Evitiamo la complessità. Avoids the immediate need for manual current_thread runtimes, CPU pinning, lock-free queues, and complex backpressure logic between acceptor and workers. The handoff is simply tokio::spawn. 

Per queste prime iterazioni, mi sembra il compromesso migliore fra qualità, performance e velocità di sviluppo. Naturalmente, iterazioni successive porteranno a cambiamenti e miglioramenti architetturali. Per adesso, questo è sufficiente per le funzionalità che lemon offre!

## Cosa lemon offre

Automatically negotiates HTTP/1.1 or HTTP/2 based on client capabilities (via ALPN for HTTPS connections). Automatic HTTPS, even offline. If you want, you can also bring your manually provisioned TLS certificate and key files. 

Lemon è disegnato per poter essere modulare, e al momento i moduli esistenti (che nel codice vengono definiti come `handlers`) sono lo *static file serving* e un supporto iniziale come *reverse proxy*. Nuovi moduli verranno aggiunti in nuove iterazioni, ma prima punto a ottimizzare e rendere stabili quanto più possibile quelli già esistenti.

Per quanto riguarda la configurazione.