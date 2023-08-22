---
sidebar_position: 2
---

import PartialDependencies from './_dependencies.md';

# Migrate From Kafka Streams

This documentation covers the information you need to know to migrate an
existing Kafka Streams application to Responsive. If you would like to see
a sandboxed example of an end-to-end app, see the [Quickstart](quickstart).

## Dependencies

Include the following dependencies into your project build.

<PartialDependencies />

## Code Migration

There are three steps to migrate a Kafka Streams application to Responsive:

### Migrate KafkaStreams

Replace usages of `KafkaStreams#new` with `ResponsiveKafkaStreams#create`.
Since `ResponsiveKafkaStreams extends KafkaStreams`, you should only need
to change invocations of the constructor:

```diff showLineNumbers
-   KafkaStreams streams = new KafkaStreams(
+   KafkaStreams streams = ResponsiveKafkaStreams.create(
      builder.build(),
      props
    );
```

### Migrate Stores

All methods in `org.apache.kafka.streams.state.Stores` have a corresponding
method in `ResponsiveStores` to help make it ergonomic to replace your
existing store usage/creation to Responsive. See some examples below for
the different Kafka Streams APIs:

<details>
<summary>
Using Stateful Operators (DSL)
</summary>

:::success

We are currently implementing [KIP-954](https://cwiki.apache.org/confluence/display/KAFKA/KIP-954%3A+expand+default+DSL+store+configuration+to+custom+types)
which will make migrating DSL applications to Responsive as simple as a single
configuration change. Until then, follow this guide.

:::

:::note Avoid Unnecessary State

🦦 You may want to examine your original topology via `Topology#describe` in 
order to locate the exact operators which are connected to state stores; Streams 
may not always materialize state for all stateful operators. Adding 
`Materialized` where there was not previously a store is not incorrect, but it
may cause unnecessary duplication of stored data that would otherwise be 
optimized away.

:::

When using the DSL, state stores are either implicitly created as necessary
or explicitly materialized via the `Materialied` class. You can create a 
Responsive store using `ResponsiveStores#materialized`:

```diff showLineNumbers
  KTable<Long, Object> table = builder.table(
    topic,
-   Materialized.as(Stores.persistentKeyValueStore("table"),
+   ResponsiveStores.materialized(ResponsiveKeyValueParams.keyValue("table")
  );
```

Note that `Materialized.as(ResponsiveStores.persistentKeyValueStore("table))`
will compile but will not perform important validation steps that prevent
errors. Prefer the `ResponsiveStores.materialized` method.
</details>

<details>
<summary>
Using Stateful Transformers (DSL + PAPI)
</summary>

If you are using the DSL in conjunction with the PAPI, you must regitser stores
manually with the `StreamsBuilder`. These stores should be modified to use
`ResponsiveStores`:

```diff showLineNumbers
  StreamsBuilder builder = new StreamsBuilder();
  builder.addStateStore(
-   Stores.keyValueStoreBuilder(Stores.persistentKeyValueStore(
+   ResponsiveStores.keyValueStoreBuilder(ResponsiveStores.persistentKeyValueStore(
      ...
    );
  );

  // this stays the same
  builder.process(() -> new Processor() {
    @Override public void init(final ProcessorContext context) {
      store = context.getStateStore(...);
    }
  }
```

</details>

<details>
<summary>
Using Processor API (PAPI)
</summary>

If you are using the PAPI, you must regitser stores manually with the 
`Topology`. These steores should be modified to use `ResponsiveStores`:

```diff showLineNumbers
  Topology topology = new Topology();

  topology.addStateStore(
-   Stores.keyValueStoreBuilder(Stores.persistentKeyValueStore(...), ...),
+   ResponsiveStores.keyValueStoreBuilder(ResponsiveStores.persistentKeyValueStore(...), ...),
    "processor-1"
  );

  // this stays the same
  topology.addProcessor("processor-1", () -> new Processor(){
    @Override public void init(final ProcessorContext context) {
      store = context.getStateStore(...);
    }
  });
```

</details>


### Migrate Tests

Responsive provides its own version of the `TopologyTestDriver` that can be
used in exactly the same way, with all the same APIs, so that all you need
to do is swap it out with `ResponsiveTopologyTestDriver`:

```diff showLineNumbers
  Topology topology = appTopology();
  TopologyTestDriver testDriver = 
-   new TopologyTestDriver(topology, props, Instant.EPOCH);
+   new ResponsiveTopologyTestDriver(topology, props, Instant.EPOCH);
```

Like the `TopologyTestDriver`, the Responsive equivalent does not require any
additional infrastructure such as a Kafka cluster or Responsive platform
components such as the storage server or operator. The driver does run with
real Responsive state stores; only the innermost layer that connects to the
remote storage engine is swapped out for a simple in-memory map. This makes
it a viable option for testing correctness and application logic.

:::note

You can check out [`ResponsiveTopologyTestDriverTest`](https://github.com/responsivedev/responsive-pub/blob/main/responsive-test-utils/src/test/java/dev/responsive/kafka/api/ResponsiveTopologyTestDriverTest.java)
for some full examples of using the `ResponsiveTopologyTestDriver` if you are 
writing new tests from scratch.

:::

## Configuration

When running your migrated Kafka Streams application with Responsive cloud
as the backend, you will need to configure these additional configurations.
These values will be provided to you:

```properties showLineNumbers
responsive.storage.hostname=<RESPONSIVE STORAGE ENDPOINT>
responsive.storage.port=9042
responsive.storage.datacenter=AWS_US_WEST_2
responsive.tenant.id=<YOUR TENANT ID>
responsive.client.id=<API KEY>
responsive.client.secret=<API SECRET>
```


## Supported Features

Responsive for Kafka Streams is intended to be a drop-in replacement for
some of the classes bundled in with Kafka Streams. Some features are still
under development. The table below gives a (non-comprehensive) overview of
the current state of what is supported.

:::info

While some features may not be supported yet, Responsive is interoperable 
with deployed Kafka Streams applications. You may mix and match deployments
of `KafkaStreams` and `ResponsiveKafkaStreams`, even within the same JVM.

:::

| Feature | Notes |
|---------|-----------|
| Apache Kafka Version Compatibility | `3.x` |
| Key Value Store | `range` and `all` are not yet supported |
| Global Store | Fully Supported |
| Window Stores| Support Coming Soon |
| Processing Guarantee | `exaclty_once_v2`, `at_least_once`  |

