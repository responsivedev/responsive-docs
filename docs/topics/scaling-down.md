# Scaling Down

How can you tell when your application has too many resources provisioned and can be scaled down?

## Thread Utilization

On the compute side, your main indicator should be whether or not your
application is actively using its processing threads. You can measure this by
looking at the Consumer’s io-wait-time-ns-total metric. This metric tells you
the total amount of time the consumer spent blocked waiting on new records to
arrive from Kafka. You can use this metric the same way you use
blocked-time-ns-total from 
[KIP-761](https://cwiki.apache.org/confluence/display/KAFKA/KIP-761%3A+Add+Total+Blocked+Time+Metric+to+Streams), 
except this time you’re computing the % of time blocked waiting for new
records. If all your threads are spending a significant portion of their time
waiting (lets say > 75%), then it’s probably safe to get rid of a node.

Note that this is different from blocked-time-ns-total, which includes time
blocked on I/O and producer control calls (like committing transactions). For
the purpose of scaling down, we want to look at how much time a thread truly
spent doing nothing that contributes to record processing. If it’s spending
time reading and writing to Kafka or an external system, the thread is still
driving meaningful work and it might not be safe to get rid of it.

## Disk Utilization

You might also notice that you’re not using as much storage as you expected. In
that case, you can allocate less storage per node. Note that you won’t be able
to do this without replacing the entire volume.

## How Much To Scale Down

If you’re scaling down by removing replicas, make sure to scale down by less or
equal to the number of standby replicas for stateful workloads. So, for example
if you run with 2 standbys, don’t scale down by more than two replicas at a
time. Otherwise you may lose all the replicas of some stores and need to
restore them before resuming processing.

<hr/>

For more context, see our blog post on 
[Sizing Kafka Streams](https://www.responsive.dev/blog/a-size-for-every-stream)
