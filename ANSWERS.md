1. What are the tradeoffs when it comes to optimizing for availability vs consistency?

- in distributed systems which are commonly used in building today's services, the data sources are horizontally scaled and are synced with each other via the network for both redundency and to provide higher throughput.

* So in this distributed data store scenario, we can use the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem) to understand the tradeoffs on what want to do with the data store.

- The theorem suggests that it is possible to only select 2 of the 3 attributes of the CAP in the real-world scenario. Since, in the distibuted systems world partition tolerance cannot be avoided, we can only really make a choice between Consistency and Availablity
- When choosing consistency, the data sources are to be kept in sync, so every write/update request would need to be propagated to all the nodes before committing the data increases the overall latency it would take thus reducing the total number of requests the system can handle at any given point in time.
- When choosing availability, the data is usually committed to a single node and assumes the data will sync over a period of time, thus immediate reads to different nodes would lead to reading stale data

2. In a real-world scenario, if you only had to choose between availability and consistency, which criteria would you pick and why?

- This question would depend on the application requirements that we are building.
- When building financial systems such as transaction ledgers, it is of utmost priority for the data to be true all the time. In this case, we have to choose consistency over availability
- Consider a celebrity tweeting something on Twitter. It is in a general sense ok for all the followers to not receive the tweet at the same time and have a slight delay. In this kind of scenario, we could choose availability over consistency.

3. Is it possible to get both - highly available and highly consistent data all the time? If no, then why? If yes, then how?
- If the data transfer and the storage speed were theoretically infinity between the data nodes, there would be 0 lag in replication and we could achieve both consistency and availability.
- But with the current technology, we would have to really choose between consistency/availability. We could make tradeoffs to find a middle ground but in the most accurate sense, it would not be possible