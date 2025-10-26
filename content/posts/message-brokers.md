---
title: "Message Brokers"
date: 2025-10-26T10:30:00+01:00
---

A message broker is middleware that receives, stores, and forwards messages between producers (senders) and consumers (receivers), enabling them to communicate asynchronously and independently of each other's availability, location, or implementation details. Instead of Service A calling Service B directly and waiting for a reply, A just publishes a message to the broker. Later, B (and maybe others) consume that message. The broker often routes, buffers, and retries automatically. This decouples systems in time, space, and load, meaning producers don't need to know who will consume the message, or whether consumers are currently online.

From a design perspective, modern brokers fall into two broad families. The first is message queues, which are designed for task-based communication. They work like job lists: each message is consumed by exactly one worker, and once acknowledged, it disappears from the queue. This model suits workloads such as order processing, background jobs, notifications. RabbitMQ, AWS SQS, Azure Service Bus belong to this group.

The second family is event streams, which treat messages as an immutable log rather than temporary tasks. Instead of removing messages after delivery, the broker appends them to a partitioned log and retains them for a defined period (or indefinitely). Consumers can read from any offset, replay history, or maintain independent positions. Of course, this model excels in event-driven architectures: Apache Kafka, Redpanda are representative technologies. 

NATS sits somewhere between these two major families. It blends characteristics of both message queues and event streams. Conceptually, NATS started as a pure pub/sub broker (we will see in a few moments the different messaging patterns): producers publish messages on subjects and subscribers receive any messages on matching subjects. There's no concept of a persistent queue or log, delivery is in-memory and ephemeral. This core model makes it closer to a real-time pub/sub system. However, over time NATS got enriched by JetStream, its persistence and streaming layer, which adds durable storage, acknowledgments, replay, and retention policies, bringing NATS closer to log-based brokers like Kafka.

As hybrid architectures continue to emerge, message brokers no longer fit into rigid categories, but this is the general picture.

Although brokers support many messaging patterns, from my point of view three stand out as foundational.

The first is the publish-subscribe pattern. One producer publishes messages to a topic, and multiple consumers subscribe to receive them. It enables broad distribution of events and loose coupling between the services. Kafka implements pub/sub natively through topics and partitions. RabbitMQ also supports it via exchanges configured in fan-out or topic mode. Pub/sub is the foundation for event-driven architectures where several independent systems need to react to the same occurrence.

The second is the work-queue or competing-consumers pattern. Multiple workers compete for messages from a single queue, and each message is handled by exactly one consumer. This approach provides horizontal scalability for task distribution. RabbitMQ is particularly strong at this pattern because of its direct and work-queue exchange types. It's interesting to note that in Kafka similar semantics are achieved through consumer groups, where messages within a partition are processed by only one consumer in the group.

The third important pattern is request-reply. It allows a system to send a request message and receive a corresponding response, usually correlated by an identifier. This pattern is usually usd in specific contexts, however, in most modern microservice architectures it has been largely replaced by direct synchronous APIs (HTTP/gRPC) for short, query-like interactions.

Moreover, message brokers differ in their delivery semantics, which define how reliably messages are transferred. Whenever a broker delivers a message to a consumer, two things can go wrong: (1) the message could be lost before it's processed; (2) the message could be delivered more than once, for example if the broker isn't sure whether the consumer processed it successfully. Delivery semantics define which of those failures a system is willing to tolerate, and how it behaves in each case. 

We can identify three standard semantics. At-most-once. The broker delivers each message zero or one-time. If the consumer or broker crashes before acknowledgement, the message is lost. This mode prioritizes speed and simplicity over reliability, since there's no retry. It's suitable for data you can afford to lose, like telemetry samples or temporary metrics.

At-least-once. The broker guarantees that every message will eventually be delivered, even if it has to retry. If the consumer crashes after processing but before confirming, the broker may resend the same message. This ensures no message loss, but duplicates are possible. Most brokers like Kafka or RabbitMQ default to this mode. And because duplicates can happen, consumers must be idempotent, meaning reprocessing the same message produces the same result without side effects.

Exactly-once. The broker ensures that each message affects the system once and only once. This requires coordination between producer, broker, and consumer. It's more complex and costly but prevents loss at duplication. Kafka supports this by specifying a *transactional.id* and enabling *idempotence*. This matters because these semantics shape how application must be written, accepting tradeoffs in different cases.

I find message brokers extremely interesting, they sit at the heart of distributed systems, handling complexity so that services don't have to. Understanding their models and guarantees is a way to reason about how software communicates, fails and recovers.