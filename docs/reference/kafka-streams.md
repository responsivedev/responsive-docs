# Kafka Streams

:::info

This page covers the basic KafkaStreams wrapper, showing how
to create a Kafka Streams application that uses Responsive
state stores.

:::

Creating your Kafka Streams application with Responsive platform is easy! Ultimately
you're just running the same old KafkaStreams you know and love, with the Responsive
state stores plugged into your topology. The [State Stores](state-stores) API reference 
shows the available options for configuring your topology, whereas this reference covers how 
to set up and run your application (or test) with that topology.

At a high level, we provide a simple wrapper for [KafkaStreams](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/KafkaStreams.html)
that establishes the connection with the Responsive storage backend and configures
everything you need to run your application. Check out the [example application](#example-application)
to see just how easy it is!

## ResponsiveKafkaStreams

The [ResponsiveKafkaStreams](https://github.com/responsivedev/responsive-pub/blob/main/kafka-client/src/main/java/dev/responsive/kafka/api/ResponsiveKafkaStreams.java)
class is the main entry point for a Responsive application, similar to the class 
[KafkaStreams](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/KafkaStreams.html) -- in fact it 
extends `KafkaStreams`, and as such all the same methods and APIs are available.

### Configuring your Application
To configure the `ResponsiveKafkaStreams`, you will need to add any Responsive properties to the config
map that you pass in to your application. Check out 
[ResponsiveConfig](https://github.com/responsivedev/responsive-pub/blob/main/kafka-client/src/main/java/dev/responsive/kafka/config/ResponsiveConfig.java)
for a full list of the optional and required configuration options available to you, alongside the usual 
`StreamsConfig` properties.

#### Required ResponsiveConfigs
Only the connection configs are required in order to configure and authorize your application with the storage backend.
The value of these configs will be provided to you, but it's up to you to make sure they get passed into the
`ResponsiveKafkaStreams`.

| ResponsiveConfig Variable | Config Name                   | Docs                                       |
|---------------------------|-------------------------------|--------------------------------------------|
| STORAGE_HOSTNAME_CONFIG   | responsive.storage.hostname   | The hostname of the storage server         |
| STORAGE_PORT_CONFIG       | responsive.storage.port       | The port of the storage server             |
| STORAGE_DATACENTER_CONFIG | responsive.storage.datacenter | The datacenter for the storage server      |
| TENANT_ID_CONFIG          | responsive.tenant.id          | The tenant ID for resource isolation       |
| CLIENT_ID_CONFIG          | responsive.client.id          | The client ID for authenticated access     |
| CLIENT_SECRET_CONFIG      | responsive.client.secret      | The client secret for authenticated access |

#### Optional ResponsiveConfigs
There are a number of performance and request related configuration options that are available for advanced users. 
We generally recommend reaching out to us for help in finding the optimal configuration for your Responsive
application, but you can check out the full list of configs in [ResponsiveConfig](https://github.com/responsivedev/responsive-pub/blob/main/kafka-client/src/main/java/dev/responsive/kafka/config/ResponsiveConfig.java).

#### Restricted StreamsConfigs
There are a few Streams properties that are controlled by Responsive and should not be overridden
as they are required for the application to function in a healthy manner.

1. `num.standby.replicas`: a Responsive application does not need standbys and may even be harmed by enabling their use. 
2. `internal.task.assignor.class`: similarly, Responsive has no need for the "high availability" features of the default task assignor, and benefits greatly from disabling this in favor of more simple assignment logic without probing rebalances or warmup tasks.
3. EOSv1 (`processing.guarantee`): Responsive is compatible with at-least-once-semantics (ALOS) and exactly-once-semantics v2 (EOSv2). If you're still using EOSv1, consider upgrading to EOSv2.

### Migrating from KafkaStreams to ResponsiveKafkaStreams
You can migrate any existing application easily by simply replacing `new KafkaStreams(...)` with
`new ResponsiveKafkaStreams(...)`. All the original `KafkaStreams` constructors are available for
`ResponsiveKafkaStreams` as well, except for those with a `StreamsConfig` parameter. If you are currently
passing in the `StreamsConfig` directly, you will need to unwrap it and pass in the configs as either
a `Properties` object or a raw `Map<?, ?>`. If you are already using one of the `KafkaStreams` constructors
that accept a `Properties` object instead of a `StreamsConfig`, then no further code changes are required.

### Creating a New ResponsiveKafkaStreams
For new applications, just create an instance of `ResponsiveKafkaStreams` with the following parameters, 
or check out the list of available constructors below.

##### ResponsiveKafkaStreams parameters
Just like with the regular `KafkaStreams`, there are two required parameters and some optional parameters.

**Required:**
1. Topology: your application topology that defines the computational logic with the stateful operators configured with Responsive state stores. Refer to [State Stores](state-stores) for details.
2. Configs: a map (or `Properties` object) that includes all required properties for both Responsive and Streams, as discussed in the [Configuration section](#configuring-your-application) above.

**Optional:**
1. KafkaClientSupplier: a supplier for kafka clients such as the admin, producer, and main/restore/global consumer.
2. Time: an implementation of `org.apache.kafka.common.utils.Time` used for some KafkaStreams functionality


<details>
    <summary>
    ResponsiveKafkaStreams constructors
    </summary>

```java showLineNumbers title="ResponsiveKafkaStreams"
/**
 * Create a {@code ResponsiveKafkaStreams} instance.
 * <p>
 * Should be used in exactly the same way as the regular {@link KafkaStreams}.
 * <p>
 * Note: even if you never call {@link #start()} on a {@code ResponsiveKafkaStreams} instance,
 * you still must {@link #close()} it to avoid resource leaks.
 *
 * @param topology       the topology specifying the computational logic
 * @param configs        map with all {@link ResponsiveConfig} and {@link StreamsConfig} props
 * @throws StreamsException if any fatal error occurs
 */
public ResponsiveKafkaStreams(
    final Topology topology,
    final Map<?, ?> configs
);

/**
 * Create a {@code ResponsiveKafkaStreams} instance.
 * <p>
 * Should be used in exactly the same way as the regular {@link KafkaStreams}.
 * <p>
 * Note: even if you never call {@link #start()} on a {@code ResponsiveKafkaStreams} instance,
 * you still must {@link #close()} it to avoid resource leaks.
 *
 * @param topology       the topology specifying the computational logic
 * @param configs        map with all {@link ResponsiveConfig} and {@link StreamsConfig} props
 * @param clientSupplier the Kafka clients supplier which provides underlying admin, producer,
 *                       and main/restore/global consumer clients
 * @throws StreamsException if any fatal error occurs
 */
public ResponsiveKafkaStreams(
    final Topology topology,
    final Map<?, ?> configs,
    final KafkaClientSupplier clientSupplier
);

/**
 * Create a {@code ResponsiveKafkaStreams} instance.
 * <p>
 * Should be used in exactly the same way as the regular {@link KafkaStreams}.
 * <p>
 * Note: even if you never call {@link #start()} on a {@code ResponsiveKafkaStreams} instance,
 * you still must {@link #close()} it to avoid resource leaks.
 *
 * @param topology       the topology specifying the computational logic
 * @param configs        map with all {@link ResponsiveConfig} and {@link StreamsConfig} props
 * @param time           {@code Time} implementation; cannot be null
 * @throws StreamsException if any fatal error occurs
 */
public ResponsiveKafkaStreams(
    final Topology topology,
    final Map<?, ?> configs,
    final Time time
);

/**
 * Create a {@code ResponsiveKafkaStreams} instance.
 * <p>
 * Should be used in exactly the same way as the regular {@link KafkaStreams}.
 * <p>
 * Note: even if you never call {@link #start()} on a {@code ResponsiveKafkaStreams} instance,
 * you still must {@link #close()} it to avoid resource leaks.
 *
 * @param topology       the topology specifying the computational logic
 * @param configs        map with all {@link ResponsiveConfig} and {@link StreamsConfig} props
 * @param clientSupplier the Kafka clients supplier which provides underlying admin, producer,
 *                       and main/restore/global consumer clients
 * @param time           {@code Time} implementation; cannot be null
 * @throws StreamsException if any fatal error occurs
 */
public ResponsiveKafkaStreams(
    final Topology topology,
    final Map<?, ?> configs,
    final KafkaClientSupplier clientSupplier,
    final Time time
);
```
</details>

### Running a ResponsiveKafkaStreams Application
Once you've created your `ResponsiveKafkaStreams`, everything in your application should look and work exactly the same
-- the Responsive connection will be established when you call `ResponsiveKafkaStreams#start`, and cleaned up when 
you call `ResponsiveKafkaStreams#close`. And all the usual tools are still available (and recommended!), such as the 
[StateListener](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/KafkaStreams.StateListener.html),
[StateRestoreListener](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/processor/StateRestoreListener.html),
and [StreamsUncaughtExceptionHandler](https://kafka.apache.org/35/javadoc/org/apache/kafka/streams/errors/StreamsUncaughtExceptionHandler.html).

### Example Application


```java showLineNumbers title="Example Application"
// Start by defining your topology -- don't forget to plug in the Responsive state stores!
final Topology topology = buildMyApplicationTopology();

// Since ResponsiveKafkaStreams extends KafkaStreams, you can continue to declare & refer to it as such
final KafkaStreams streams = new ResponsiveKafkaStreams(topology, props);

// Always remember to close the application and clean up any resources -- even if it hasn't been started
Runtime.getRuntime().addShutdownHook(new Thread(streams::close));

// A StateListener can be useful for logging, external synchronization, and much more
streams.setStateListener((oldState, newState) -> {
  if (oldState == State.CREATED && newState == State.REBALANCING) {
    LOG.info("Application is starting!");
  }
});

// The default handler will shut down the client, but sometimes you want to just replace the thread and retry
streams.setUncaughtExceptionHandler(t -> StreamThreadExceptionResponse.REPLACE_THREAD);

// Finally, start the application!
streams.start();
```


