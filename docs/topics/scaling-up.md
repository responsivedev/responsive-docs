import OssCaution from './_oss-caution.md';

# Scaling Up

<OssCaution />

So you’ve decided to scale up. The things to think about here are

1. Should I scale vertically or horizontally?
2. How much?
3. What do I monitor to keep track of the scaling process?

## Vertical vs Horizontal

Choosing to scale horizontally by adding nodes vs vertically by provisioning 
nodes with more resources is a bit of an art. You want nodes that are not “too
big” or “too small”. Nodes that are too small will have more overhead,
unrelated to record processing, from the VM and/or container runtime and the
JVM. Nodes that are too large may not play nice with your compute infra - for
example if you’re using Kubernetes, you need to make sure your container
resource requests actually fit on your cluster’s nodes. The node size also
determines how granular you can be when scaling horizontally.

## How Much To Scale Up

In most cases, choosing how much to scale up is also a bit of an art - you’ll
have to try and see what the results are, and iterate from there.

One exception is when deciding how many replicas to add when reacting to
growing lag. In this case it’s probably a good bet that your application’s
throughput will scale linearly with the number of replicas. Therefore, you can
try to look at the ratio between the current append rates at your source topics
and your application’s current processing rate and try to scale up to meet the
append rate. So, if your application is processing 100 records per second at
its source topics and the source topics are being appended to at 400 records
per second, then try 4 times as many replicas as you currently have. The
benefit here is that you hopefully need to scale up fewer times. Each scale up
requires adding new resources, rebalancing, and restoring all your state - so
the fewer you need to do the better.

Note that this will probably not give you the “correct” number of replicas the
first time. This is because of the way Kafka Streams passes data down the
sub-topology graph. Imagine an application with two sub-topologies. The first
sub-topology reads from a source topic, rekeys the records, and writes to a
repartition topic. The second sub-topology reads from the repartition topic and
performs an aggregation. If your application is not able to keep up with the
source topic, and you scale it, then it’s going to start writing much more data
into the repartition topics and its likely that the second sub-topology will
start to lag. So you’ll have to iterate to get to the real number of replicas
that you need.

## Monitoring Scale-Up


<div style={{'text-align': 'center'}}>
<img src="/img/scaleup.png" width="480" />
</div>


Once you’ve added or replaced nodes, you’ll need to monitor the rebalancing
process so that you know when the new resources are fully initialized and being
used by Kafka Streams to process more records. This is especially important for
stateful applications, which replicate state to the new node(s) by creating
warm up replicas of tasks, which transition to active only when sufficiently
caught up — a process that can take minutes or even hours if there is lots of
built up state.

The key indicators you should be watching are:

- `last-rebalance-seconds-ago`: You’ll want to keep an eye on rebalances. 
  Kafka Streams will rebalance to decide the new task assignment after the 
  new replica is added, and will continuously do probing rebalances to track 
  warmup progress and transition replicas to active. If you see that this 
  value continues to increase on all clients, then that’s a good indication 
  that things have stabilized.
- `records-lag`: Keep an eye on the current lag of the restore consumers 
  on the newly added nodes. The restore consumers will have the token 
  `restore-consumer` in their client IDs, for example 
  `example-36e36732-6b13-4423-a039-3c1d650c1d1f-streamthread-1-restore-consumer`

Warmup tasks will transition to active tasks as the lag approaches 0.
Once these indicators are healthy, your new nodes should be actively processing
data and you can re-evaluate your sizing.

## Gotchas

There’s a couple gotchas that can bite you and cause you to not observe the expected gains from scaling up:

- Make sure that the application has enough tasks to distribute across the nodes
 you’re scaling to. You want to make sure there is at least one task per thread
 over all your nodes. If not, you will have added resources but they won’t be
 assigned any tasks and won’t be used.
- If your load has significant skew, then you might not see the expected
 improvements from scaling up. For example, if all your data is being written to
 one of your source partitions, then Kafka Streams won’t be able to distribute
 that work over the added nodes.

<hr/>

For more context, see our blog post on 
[Sizing Kafka Streams](https://www.responsive.dev/blog/a-size-for-every-stream)
