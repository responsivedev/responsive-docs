# State Stores

:::info

This page introduces the different Kafka Streams State Store implementations available
in Responsive and how to configure them.

::: 

## Store Types

Responsive supports the three main store types of Kafka Streams:
1. [KeyValueStore](#keyvaluestore)
2. [WindowStore](#windowstore) (coming soon!)
3. [SessionStore](#sessionstore) (coming soon!)

### KeyValueStore

Key-value stores are stores that support simple key-value operations, as well
as some additional query functionality such as retrieving all or a certain
range of keys. Check out the
[javadocs](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/state/KeyValueStore.html) 
for more details.

There are two sub-types of the key-value store:

1. [Key-Value Store](#key-value-store) (the default -- if you're not sure which one to use, pick the plain key-value store)
2. [Fact Store](#fact-store)

#### Key-Value Store
This is your basic key-value store with the same semantics and functionality as 
the default KeyValueStore in Kafka Streams. For the majority of use cases, this 
will be the appropriate choice. Generally all stateful DSL operators should be
using this sub-type.

#### Fact Store
A fact store assumes that either all writes for a given key will always have the same 
value, or the user of the store is value-agnostic and cares only about the keys.
The implementation does not enforce this constraint, but may return stale values
and should be used with caution.

For those applications that fit the described criteria, this store can show
significantly better performance by optimizing the consistency protocol to
allow split-brain writes that would otherwise have been fenced.

Examples of usage patterns that make good use of a fact store:
- A deduplication store that records whether or not a key has been seen.
- Sensor data that reports measurements from sensors as time-series data.
- Processing of keyed events with no payload, where the value is missing or ignored.

Delete operations, while supported, are not recommended on fact tables as it
can prevent data from properly being cleaned. If deletion is required to avoid
unbounded growth, consider specifying a time-to-live (`ttl`) instead. This can
be set using the [`ResponsiveKeyValueParams`](#responsivekeyvalueparams) covered in more detail below.

### WindowStore

:::caution Not Yet Implemented

Time windowed stores are not yet implemented, check back soon or follow our blog
for release announcements!

:::


### SessionStore

:::caution Not Yet Implemented

Session windowed stores are not yet implemented, check back soon or follow our blog
for release announcements!

:::

## Plugging Responsive  into your Topology

All Responsive state stores can be generated through the [ResponsiveStores](#responsivestores)
factory, covered in more detail below. Use these when building your 
`org.apache.kafka.streams.Topology` to easily swap in Responsive stores wherever 
state is used. You can plug these into your topology in exactly the same way you
would nor

See [`org.apache.kafka.streams.state.Stores`](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/state/Stores.html)
for instructions on how to plug in custom state stores and configure them, or 
[Migrate Kafka Streams](../getting-started/migrate-kafka-streams#migrate-stores)
for some examples of migrating an existing application topology.

### ResponsiveStores

A factory for creating Kafka Streams state stores on top of a Responsive storage
backend. This class includes static APIs for all store types and usages, whether
you are plugging them into a DSL operator, transformer, or PAPI processor.

We also include type-specific parameters that can be used to enable features that 
are exclusive to Responsive, such as `ttl` for key-value stores and changelog 
truncation. See [Responsive Params](#responsive-params) for more information on the available options.

#### DSL operators
For DSL operators, you will need to use the `ResponsiveStores#materialized` API to obtain
a `Materialized` object for each stateful operator in your topology.

```java showLineNumbers title="Example Usage (DSL)"
KTable<String, Long> wordCounts = textLines
  .flatMapValues(textLine -> Arrays.asList(textLine.toLowerCase().split("\\W+")))
  .groupBy((key, word) -> word)
// highlight-next-line
  .count(ResponsiveStores.materialized(ResponsiveKeyValueParams.keyValue("counts-store")));
```

#### PAPI
For PAPI processors and DSL transformers, you will instead be using the `ResponsiveStores#keyValueStore`
to get a `StoreSupplier` and then pass it into a `ResponsiveStores#keyValueStoreBuilder`
or `ResponsiveStores#timestampedKeyValueStoreBuilder` to get a `StoreBuilder`. You should
again have one `StoreBuilder` (with a unique `StoreSupplier`) for each state store.

```java {2-4} showLineNumbers title="Example Usage (PAPI)"
    builder.addStateStore(
        ResponsiveStores.timestampedKeyValueStoreBuilder(
                .keyValueStore(ResponsiveKeyValueParams.fact(STATE_STORE)
                .withTimeToLive(Duration.ofDays(30))),
            new StringSerde(),
            new StringSerde()
        )
    );
```

### Notable Methods

| Method Name                                                                                                                              | Notes                                                                                                                                                                                                                                                                                                                                 |
|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <pre>keyValueStore( <br />    ResponsiveKeyValueParams <br />)</pre>                                                                     | Returns a key-value `StoreSupplier`. This method should be preferred over `keyValueStore(String)` as it provides additional functionality for configuring features unique to responsive, such as `ttl`, changelog truncation, and the `fact` variant. <br /><br />  See also [`ResponsiveKeyValueParams`](#responsivekeyvalueparams). |
| <pre>materialized( <br />    ResponsiveKeyValueParams <br />)</pre>                                                                      | Similar to the above methods, but for use in the Kafka Streams DSL.                                                                                                                                                                                                                                                                   |
| <pre>keyValueStoreBuilder( <br />    KeyValueBytesStoreSupplier, <br />    Serde&ltK&gt, <br />    Serde&ltV&gt <br />)</pre>            | Returns a key-value `StoreBuilder` that can be passed in to custom processors or transformers. Make sure to pass in the `StoreSupplier` from `#keyValueStore(ResponsiveKeyValueParams)`.                                                                                                                                              |
| <pre>timestampedKeyValueStoreBuilder( <br />    KeyValueBytesStoreSupplier, <br />    Serde&ltK&gt, <br />    Serde&ltV&gt <br />)</pre> | Returns a timestamped key-value `StoreBuilder` that can be passed in to custom processors or transformers. A timestamped store can be used to store a timestamp associated with each record. Make sure to pass in the `StoreSupplier` from `#keyValueStore(ResponsiveKeyValueParams)`.                                                |

## Responsive Parameters
In addition to the usual configuration options for state stores (eg store name), we provide
several optional Responsive features that are specific to each [store type](#store-types).


### ResponsiveKeyValueParams

A parameter class that contains the configuration options for all 
[KeyValueStores](#keyvaluestore) types.

#### Notable Methods


| Method Name                        | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <pre>keyValue(String)</pre>        | Indicates that the desired store should be a [key-value store](#key-value-store)                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| <pre>fact(String)</pre>            | Indicates that the desired store should be a [fact store](#fact-store)                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <pre>withTimeToLive()</pre>        | Sets a time-to-live (`ttl`) on the store created with these parameters. <br /><br /> `ttl` works on a wall-clock basis, meaning the records that are inserted will no longer be retrievable after `ttl` has elapsed independent of whether or not stream time is advanced. For more information on the distinction between stream/wallclock time see the [Kafka Streams docs](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/processor/PunctuationType.html)                                                    |
| <pre>withTruncateChangelog()</pre> | Indicates that Responsive should delete records from the store's changelog topic once they have been committed successfully to the remote state store. This is an optimization to avoid storing duplicate data that has already been persisted to the Responsive storage backend and is no longer needed by this Kafka Streams application. Not compatible with tables using the source-topic changelog optimization.<br/> <br/> Caution: do not enable if there are downstream dependencies that consume from the changelog. |


### ResponsiveWindowParams

:::caution Not Yet Implemented

Time windowed stores are not yet implemented, check back soon or follow our blog
for release announcements!

:::

### ResponsiveSessionParams

:::caution Not Yet Implemented

Session windowed stores are not yet implemented, check back soon or follow our blog
for release announcements!

:::