import OssCaution from './_oss-caution.md';

# Tuning RocksDB

<OssCaution />

Tuning RocksDB is notoriously difficult. A good place to start is 
[this guide](https://www.confluent.io/blog/how-to-tune-rocksdb-kafka-streams-state-stores-performance/)), 
written by the wonderful Kafka Streams committers and one of the 
founders of RocksDB.

## Tuning Multiple Colocated RocksDB Instances

When multiple RocksDB instances are running on a single node, they don't 
(by default) share a cache or write buffer. Since physical memory on your 
node is constrained (RocksDB and the JVM can't share the same memory), in 
practice these buffers are either tuned to be relatively small or flushed 
before they're full to avoid memory pressure. You can tune this using 
`Options#setWriteBufferSize` when configuring a 
[`RocksDBConfigSetter`](https://kafka.apache.org/36/javadoc/org/apache/kafka/streams/state/RocksDBConfigSetter.html) 
in Kafka Streams.

We learned the hard way (in production) that this invalidates one of 
RocksDB's fundamental performance assumptions: that random writes can 
be effectively batched and written to disk in predictably sized chunks, 
called SSTables. If SSTables are flushed to disk too early, you'll get 
increased write amplification, more compaction, and poor cache coherency.

These set of problems, unfortunately, are intrinsically tied to the 
architecture of Kafka Streams and RocksDB. There are, however, some rules 
of thumb you can follow to avoid running into issues:

1. Limit Number of State Stores: Try to keep the number of state stores 
   on a single node under 30. Anecdotally, we determined that 20-30 is 
   the magic range of states stores you can have on a single Kafka Streams 
   application before you start seeing unpredictable behavior, and 
   anywhere north of 50 is asking for trouble (we ran with m5.xlarge instances 
   and EBS in AWS). Note that this means if you have 16 input partitions 
   and multiple sub-topologies, you should be scaling out!
2. Reserve Memory for RocksDB: The following number can fluctuate, but a 
   good starting point is to size your cluster such that you reserve at 
   least 25% of available memory for RocksDB. If you notice memory 
   pressure from RocksDB (one or more of these metrics is high: 
   `size-all-mem-tables`, `block-cache-usage`, `block-cache-pinned-usage`, 
   `estimate-table-readers-mem`) and your JVM memory is under-utilized, or 
   vice versa, then you can consider shifting this balance around. For more 
   information on how we came to that number, read this blog written by our 
   co-founder Rohan during his time at Confluent.
3. Use Jemalloc: Believe it or not, RocksDB cache can interact poorly with glibc, 
   the default memory allocator on Linux! Instead, we recommend you to use 
   `jemalloc`.

<hr/>


For more context, see our blog post on 
[Managing Stateful Kafka Streams apps](https://www.responsive.dev/blog/guide-to-kafka-streams-state)
