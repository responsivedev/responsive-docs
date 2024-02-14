---
id: Changelog
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Changelog

## Feb 13, 2024

### Kafka Client (0.16.0)


✨**GA for MongoDB Stores**:
MongoDB is now considered generally available and supports nearly all of the
Kafka Streams operations, including IQ and windowed stores.

✨[responsive-pub/221](https://github.com/responsivedev/responsive-pub/pull/221):
We made various improvements to performance, including this super cool PR to
maintain local per-window bloom filters to avoid looking data up in remote storage
if it's known not to exist during a window. 

## Dec 18, 2023

### Kafka Client (0.15.0)


✨[responsive-pub/163](https://github.com/responsivedev/responsive-pub/pull/163):
This change supports backing MongoDB storage! With the release, MongoDB is still
in Beta but supports EOS and KV Tables.

✨[responsive-pub/181](https://github.com/responsivedev/responsive-pub/pull/181):
Cassandra implementation now supports Window stores!

✨[responsive-pub/191](https://github.com/responsivedev/responsive-pub/pull/191):
You no longer need to configure OTEL agent in order to integrate with Responsive.
Simply set `responsive.metrics.enabled=true` in your configuration file along with
the API key/secret provided.

✨[responsive-pub/167](https://github.com/responsivedev/responsive-pub/pull/167):
This is one of many PRs that have improved out metric suite to include a bunch
of new metrics. Some of my personal favorites:
- Metrics around the current kafka streams state (`RUNNING`, `REBALANCING`, etc...)
- Some metrics around the Responsive Cache effecitveness
- Additional metrics around restoration/thread errors


## October 16, 2023

### Breaking Changes (Code Incompatibility)

#### Kakfa Client (0.14.0)

❗[responsive-pub/134](https://github.com/responsivedev/responsive-pub/pull/134) 
and [responsive-pub/135](https://github.com/responsivedev/responsive-pub/pull/135)
changed the way a new instance of `ResponsiveKafkaStreams` is created. These
changes apply to `dev.responsive.kafka-client` versions `0.14.0` and above.

Please modify your code to use the constructor in place of the static factory 
method:

```diff showLineNumbers
-  KafkaStreams streams = ResponsiveKafkaStreams.create(...);
+  KafkaStreams streams = new ResponsiveKafkaStreams(...);
```

It also removed the timestamped versions of the `StoreSuppliers` since all 
Responsive store implementations are compatible with timestamps. To create a 
timestamped store, you now only need to specify it in one place: the `StoreBuilder`. 
For a timestamped KeyValueStore you will still be using the 
`ResponsiveStores#timestampedKeyValueStoreBuilder` API, but can now pass in any kind 
of `KeyValueBytesStoreSupplier` provided by `ResponsiveStores`.  You can apply all 
of these changes to your application code with the following `sed` commands:

```bash
FILE="<application-code-file-path>"
sed -ie "s|ResponsiveKafkaStreams.create|new ResponsiveKafkaStreams|g" ${FILE}
sed -ie "s|ResponsiveKeyValueParams.timestamped|ResponsiveKeyValueParams.keyValue|g" ${FILE}
sed -ie "s|ResponsiveKeyValueParams.timestampedFact|ResponsiveKeyValueParams.fact|g" ${FILE}
sed -ie "s|ResponsiveStores.timestampedKeyValueStore|ResponsiveStores.keyValueStore|g" ${FILE}
```

❗[responsive-pub/148](https://github.com/responsivedev/responsive-pub/pull/148):
This change restructured code to distinguish between public apis and
internal implementation classes. Some classes, therefore, may have slightly
shifted package names. If your application fails to compile after Responsive client 
versions, remove the imports that are not found and re-import them with the same 
class name.

### Kafka Client (0.14.0)

✨[responsive-pub/133](https://github.com/responsivedev/responsive-pub/pull/133):
Support configuring changelog truncation. This feature will allow you to 
optionally truncate changelogs when using Responsive stores to reduce storage
utilization on your Kafka cluster. We recommend leaving the changelog enabled as
an additional source of data recovery. Responsive guarantees durability of your
records independently from this features.

✨[responsive-pub/144](https://github.com/responsivedev/responsive-pub/pull/144):
Responsive now supports `GlobalKTables`! You can now create `GlobalKTables` 
backed by Responsive's remote storage. Plugging them into your Streams 
application is just as easy (and in fact exactly the same) as configuring a 
regular KTable or KeyValueStore using `ResponsiveStores`:

```java
    final GlobalKTable<Long, Long> globalTable = builder.globalTable(
        GLOBAL_TOPIC,
        ResponsiveStores.materialized(ResponsiveKeyValueParams.keyValue(STORE_NAME))
    );
```

✨ [responsive-pub/150](https://github.com/responsivedev/responsive-pub/pull/150):
Responsive platform is now compatible with all topology optimizations, including 
the previously restricted config option `reuse.ktable.source.topics`. This 
optimization enables source KTables to reuse their input topic as a changelog, 
avoiding the need to duplicate the source topic contents.  Note that this 
optimization is incompatible with the new changelog truncation feature, however, and
applying it will automatically disable changelog truncation for all source KTables.


🐛 [responsive-pub/119](https://github.com/responsivedev/responsive-pub/pull/119):
Fixes a bug in the handling of writes with a `null` value so that they are 
correctly identified as a tombstone.

🐛 [responsive-pub/146](https://github.com/responsivedev/responsive-pub/pull/146):
Fixes an (internal) bug where the internal property `grace_gc_seconds` was not 
correctly configured for state stores with TTL enabled.

### Operator (0.14.0)

✨[responsive-pub/120](https://github.com/responsivedev/responsive-pub/pull/120):
The [Expected Latency Diagnoser](https://docs.responsive.dev/reference/controller-policies#expected-latency) 
was introduced, which allows you to specify a goal for the expected  latency 
of a record being processed by a subtopology. The "expected latency" is defined 
here as the amount of time between when the record is enqueued on the source 
topic and the point at which it has finished being processed through the 
subtopology.

✨[responsive-pub/131](https://github.com/responsivedev/responsive-pub/pull/131):
Introduced the [Thread Saturation Diagnoser](https://docs.responsive.dev/reference/controller-policies#thread-saturation), 
which will scale down the number of nodes in your application if threads are not 
being fully utilized.

