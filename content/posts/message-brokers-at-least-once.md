---
title: "At-Least-Once Delivery"
date: 2025-10-28T23:00:00+01:00
---

When we talk about reliable message delivery, we're really talking about what happens when something goes wrong: a crash, a timeout, ...
The broker, producer, and consumer all participate in this contract. So we can see that reliability is the combination of how the broker tracks acknowledgements, how producers handle retries or duplicates, how consumers confirm processing, and whether messages persist across crashes. How do brokers implement those guarantees? In this post, I will cover the *at-least-once* delivery.

When a consumer receives a message, the broker must know if it was processed successfully. That happens through an acknowledgement (ack).

The simplest flow is:

```markdown
Producer -> Broker:     SEND message
Broker -> Consumer:     DELIVER message
Consumer -> Broker:     ACK message-id
```

If the broker doesn't receive the ack before a timeout, it assumes the consumer crashed and redelivers the message.

That retry mechanism is what gives us at-least-once delivery. The upside, the message won't be lost. The downside, it might be seen twice.

Different systems implement this differently.

RabbitMQ implements acknowledgments at the individual-message level and uses its queue data structure to decide when to redeliver. Messages stay in RAM or on disk until acked.

Kafka's approach is fundamentally different: acknowledgment is not per message but per offset in an ordered log. The consumer, not the broker, controls when messages are considered processed. Consumers poll and process messages sequentially, maintaining in fact a local offset pointer ("how far I've read"). So the acknowledgment is translated in committing the offset. Kafka brokers don't redeliver messages, clients simply re-read uncommitted offsets.

NATS sits between RabbitMQ's per-message acks and Kafka's offset model. Each consumer has its own ack policy (`AckNone`, `AckAll`, `AckExplicit`) and specifies an `ack_wait` duration. If the broker doesn't receive an ack within that window, it redelivers the message. Ack state lives in the broker, by storing per-consumer metadata. It's more a hybrid model.

When a broker retries multiple times without ever getting an ack, it's a strong signal that something is wrong with the consumer or with the message itself. As we've seen, we've identified a *general* pattern: (1) message is delivered to a consumer, (2) generally, an ack timer starts, (3) the timer expires, so the broker redelivers, (4) this cycle repeats several times. At this point, the broker must decide how to handle a message that never gets acknowledged. 

In mature systems, after a high number of retries or a time threshold, the broker stops trying to redeliver the message endlessly and applies one of the following policies.

Dead-Letter Queue, where the message is moved to a special queue or topic after n failed delivery attempts. There may be additional metadata, such as number of delivery attempts and last error message or timestamp.

Parking/Holding Queue, which is similar to DLQ but temporary: the broker just sets aside stuck messages to retry later.

Backoff: instead of retrying immediately, the broker waits longer between retries.

Finally, drop: for best-effort workloads, like telemetry, the broker may simply drop the message after a number of failed attempts.

So the retry is a main strategy, and once it enters the picture, duplicates become inevitable. Example: a consumer might process a message and then crash before sending the ack, and when it comes back the broker resends the same message. Idempotency plays an important role, and it guarantees that a consumer can safely handle the same message twice without side-effects.

A typical deduplication technique is to assign a unique ID to each message. The consumer then keeps a short-term deduplication store. Before processing, the consumer checks if that ID was already handled. Kafka’s idempotent producer works similarly: it assigns sequence numbers to each message and ensures the broker discards duplicates on resend. 

In my first blog post about Message Brokers we've also seen that *exactly-once* exists as a delivery semantic, but I think that it is rarely exact. And here, we enter somewhat into the realm of relativism. In distributed systems, *exactly-once* only holds within one broker's domain, not across APIs, databases ...
Once you leave the broker, we enter a world of retries and partial failures. That's why most productive environments focus on idempotent consumers rather than chasing exactly-once across systems.

In the end, I think delivery failures should be prevented by making them predictable, and by making sure they don't matter.