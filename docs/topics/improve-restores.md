# Improve Restoration

The set below are miscellaneous improvements that speed up restores:

1. Persistent Volumes: You can configure all disks attached to compute nodes using 
   Kubernetes Stateful Sets are configured to use PVCs (in AWS this would attach an 
   EBS volume to your node). This means that if the pod had to be replaced, Kubernetes 
   will simply attach the volume to a new pod. This only helps in a narrow, but common, 
   set of scenarios — specifically those that directly replace a node with another or 
   restart a node. Usually a restore is triggered when only a subset of partitions on 
   a node need to move to a new one, which is not helped by using persistent volumes. 
   Note that when EOS is configured, a node failure that is not a clean shutdown will 
   need to restore even when using PVCs since it is considered “corrupted”.
2. Tuning Restore Consumer Configuration: Kafka Streams understands that the 
   characteristics of restoration can differ vastly from steady state processing, so 
   it offers the ability to tune your restore and main consumers separately. Any 
   configurations that start with `restore.consumer` and `main.consumer` will affect 
   only the restore and main consumers respectively. There are various documented ways 
   to tune throughput on your consumers, such as increasing 
   [`max.poll.records`](https://kafka.apache.org/documentation/#consumerconfigs_max.poll.records)
   (which will transitively improve batching when writing to RocksDB), which you can 
   safely apply to your restore consumer without sacrificing end-to-end latency on your 
   main consumer tasks.
3. Implementing Custom State Stores: Some implementations attempt to replace RocksDB 
   with a faster alternative, others use state-shipping approaches where they backup 
   snapshots of the state to S3 and recover the data manually. These custom approaches 
   often require large investments, getting all the details right (such as EOS) is 
   challenging, but promise significant improvements. Responsive uses a remote store 
   optimized for Kafka Streams use cases and we've solved those hard problems for you.

<hr/>

For more context, see our blog post on 
[Managing Stateful Kafka Streams apps](https://www.responsive.dev/blog/guide-to-kafka-streams-state)
