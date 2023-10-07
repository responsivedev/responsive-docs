---
id: Changelog
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Changelog

## October 6, 2023

### Breaking Changes (Code Incompatibility)

❗[responsive-pub/134](https://github.com/responsivedev/responsive-pub/pull/134) 
and [responsive-pub/135](https://github.com/responsivedev/responsive-pub/pull/135)
changed the way a new instance of `ResponsiveKafkaStreams` is created. These
changes apply to `dev.responsive.kafka-client` versions `0.12.0` and above.

Please modify your code to use the constructor place of the static factory 
method:

```diff showLineNumbers
-  KafkaStreams streams = ResponsiveKafkaStreams.create(...);
+  KafkaStreams streams = new ResponsiveKafkaStreams(...);
```

It also removed the timestamped verisons of `StoreSuppliers` since all Responsive
stores are timestamped. You can apply all of these changes with the following
`sed` commands:

```bash
sed -ie "s|ResponsiveKafkaStreams.create|new ResponsiveKafkaStreams|g" ${FILE}
sed -ie "s|ResponsiveKeyValueParams.timestamped|ResponsiveKeyValueParams.keyValue|g" ${FILE}
sed -ie "s|ResponsiveKeyValueParams.timestampedFact|ResponsiveKeyValueParams.fact|g" ${FILE}
sed -ie "s|ResponsiveStores.timestampedKeyValueStore|ResponsiveStores.keyValueStore|g" ${FILE}
```

❗[responsive-pub/148](https://github.com/responsivedev/responsive-pub/pull/148):
This change restructured code so to distinguish between public apis and
internal implementation classes. Some classes, therefore, may have slightly
shifted package names. If you fail to compile after upgrading versions,
remove the imports that are not found and re-import them with the same class
name.


### Operator (0.10.0)

✨[responsive-pub/120](https://github.com/responsivedev/responsive-pub/pull/120):
[Expected Latency](https://docs.responsive.dev/reference/controller-policies#expected-latency)
diagnoser was introduced that allows you to specify a goal for the expected 
latency for a record to be processed at a sub-topology (how long it takes
from the point it is enqueud on to the topic to when it has been processed).

✨[responsive-pub/131](https://github.com/responsivedev/responsive-pub/pull/131):
Introduced a [Thread Saturation Diagnoser](https://docs.responsive.dev/reference/controller-policies#thread-saturation), 
which will scale down the number of nodes in your application if threads are not 
being fully utilized.

### Kafka Client (0.12.0)

✨[responsive-pub/133](https://github.com/responsivedev/responsive-pub/pull/133):
Support configuring changelog truncation. This feature will allow you to 
optionally truncate changelogs when using Responsive stores to reduce storage
utilization on your Kafka cluster. We recommend leaving it enabled as an
additional source of data recovery.

✨[responsive-pub/144](https://github.com/responsivedev/responsive-pub/pull/144):
Responsive now supports `GlobalKTable`! You may now create `GlobalKTables`
with `ResponsiveStres`:

```java
    final GlobalKTable<Long, Long> globalTable = builder.globalTable(
        GLOBAL_TOPIC,
        ResponsiveStores.materialized(ResponsiveKeyValueParams.keyValue(STORE_NAME))
    );
```

✨ [responsive-pub/150](https://github.com/responsivedev/responsive-pub/pull/150):
Responsive now is able to handle all topology optimizations, including reusing 
source topics as changelogs, which was previously a restricted config.


🐛 [responsive-pub/119](https://github.com/responsivedev/responsive-pub/pull/119):
Fix a bug where a `null` value in `put(key, value)` would incorrectly not result 
in a tombstone.

🐛 [responsive-pub/146](https://github.com/responsivedev/responsive-pub/pull/146):
Fix a bug where the `grace_gc_seconds` were not correctly configured for tables
with TTL enabled. 
