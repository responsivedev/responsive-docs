import OssCaution from './_oss-caution.md';

# Preventing Rebalances

<OssCaution />

These set of improvements attempt to hide the overhead of restoration, 
so if a rebalance does happen it doesn't disrupt normal operations:

1. Standby Replicas: a standby replica (configured using 
   [`num.standby.replicas`](https://kafka.apache.org/documentation/#streamsconfigs_num.standby.replicas))
   is a replica that is perpetually in restoration 
   mode but does not block processing of active tasks. If a failover happens, 
   the Kafka Streams Partition Assignor will convert the standby to an active 
   and ensure that the only restoration that needs to take place is any lag 
   the standby was experiencing relative to the active task. Standby replicas 
   come with numerous drawbacks — most obviously they (a) multiply the 
   required disk space to run your Kafka Streams application, (b) increase load 
   on your application nodes, (c) rack up cloud costs by multiplying the network 
   utilization from Kafka, (d) increase load on your Kafka brokers and finally 
   (e) contribute to additional complexity in the assignment protocol.
2. Warmup Replicas: Warmup replicas differ from Standbys in that they are 
   ephemeral and scheduled “on demand”. These are primarily used for scaling 
   up the number of Kafka Streams nodes so that the newly provisioned 
   resources have time to catch up before taking over ownership of partitions. 
   The primary drawback of warmup replicas is that they complicate the assignment 
   protocol and often leave the application unbalanced. Configuring warmup 
   replicas is a little tricky, but can be done using 
   [`max.warmup.replicas`](https://kafka.apache.org/documentation/#streamsconfigs_max.warmup.replicas) 
   and [`acceptable.recovery.lag`](https://kafka.apache.org/documentation/#streamsconfigs_acceptable.recovery.lag).
   Note that in order to have high availability both in failure and scaling situations, 
   you must configure both Standby and Warmup replicas; they are not interchangeable.
3. Moving Restoration to a Dedicated Thread: one of the more exciting new features 
   that's in preview with Kafka 3.5 is a re-architecture of the threading model 
   to move restoration to a separate thread 
   ([KAFKA-10199](https://issues.apache.org/jira/browse/KAFKA-10199)). This work not 
   only solves the issue in the deep dive above, but also a host of other problems 
   related to restoration blocking active task processing. If you're interested in 
   the details of how this works or how to enable it in your application, refer to 
   [this talk](https://www.slideshare.net/HostedbyConfluent/restoring-restorations-reputation-in-kafka-streams-with-bruno-cadonna-lucas-brutschy) 
   at Kafka Summit.

<hr/>

For more context, see our blog post on 
[Managing Stateful Kafka Streams apps](https://www.responsive.dev/blog/guide-to-kafka-streams-state)
