# State Stores

```
TODO(@apurva): write introduction
```

## Store Schemas

### Key Value

Key Value stores are stores that support simple key-value operations, as well
as some additional query functionality such as retreiving all or a certain
range of keys.


#### Fact Schema {#fact-schema}

A fact store assumes that all writes for a given key will always have the same 
value. The implementation does not enforce this constraint, instead it uses the 
assumption to optimize the consistency protocol by allowing split-brain writes 
to go unfenced. 


Examples of usage patterns that make good use of a fact store:
- A deduplication store that records whether or not a key has been seen.
- Sensor data that reports measurements from sensors as time-series data.

Delete operations, while supported, are not recommended on fact tables as it
can prevent data from properly being cleaned. Instead it is better to set a
time-to-live (`ttl`) when specifying the [`ResponsiveKeyValueParams`](#params).


### Time Windowed

```
TODO(@sophie): fill me in!
```

### Session Windowed

:::caution Not Yet Implemented

Session stores are not yet implemented, check back soon or follow our blog
for changelog annoucnements!

:::


## `ResponsiveStores`

A factory for creating Kafka Streams state stores on top of a Responsive storage
backend.  Use these when building your `org.apache.kafka.streams.Topology` to 
easily swap in Responsive stores wherever state is used.

See [`org.apache.kafka.streams.state.Stores`](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/state/Stores.html) 
for instructions on how to plug in custom state stores and configure them.

```java showLineNumbers title="Example Usage (DSL)"
KTable<String, Long> wordCounts = textLines
  .flatMapValues(textLine -> Arrays.asList(textLine.toLowerCase().split("\\W+")))
  .groupBy((key, word) -> word)
// highlight-next-line
  .count(ResponsiveStores.materialized(ResponsiveKeyValueParams.keyValue("counts-store")));
```

```java {2-4} showLineNumbers title="Example Usage (PAPI)"
    builder.addStateStore(
        ResponsiveStores.keyValueStoreBuilder(
                .keyValueStore(ResponsiveKeyValueParams.timestampedFact(STATE_STORE)
                .withTimeToLive(Duration.ofDays(30))),
            new StringSerde(),
            new StringSerde()
        )
    );
```

### Notable Methods

| Method Name | Notes |
| ------------|-------|
| `keyValueStore(ResponsiveKeyValueParams)` | This method should be prefered over `keyValueStore(String)` as it provides additional functionality for configuring features unique to responsive, such as `ttl`, and the `timestamped` or `fact` variants. <br /><br />  Also see [`ResponsiveKeyValueParams`](#params). |
| `materialized(ResponsiveKeyValueParams)` | Similar to the above methods, but for use in the Kafka Streams DSL |

## `ResponsiveKeyValueParams` {#params}

A paramter class that contains the configuration options for all stores with 
the [Key Value Schema](#key-value-schema).

### Notable Methods


| Method Name | Notes |
| ------------|-------|
| `keyValue(String)` | Indicates that the desired store should be a key value store |
| `timestamped(String)` | Indicates that the desired store should be a timestamped key value store |
| `fact(String)` | Indicates that the desired store should be a [fact store](#fact-schema) |
| `timestampedFact(String)` | Indicates that the desired store should be a timestamped fact store  |
| `withTimeToLive` | Sets a time-to-live (`ttl`) on the store created wit these parameters. <br /><br /> `ttl` works on a wall-clock basis, meaning the records that are inserted will no longer be retrievable after `ttl` has elapsed independent of whether or not stream time is advanced. For more information on the distinction between stream/wall time see the [Kafka Streams docs](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/processor/PunctuationType.html) |
