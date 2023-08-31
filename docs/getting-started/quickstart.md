---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import PartialDependencies from './_dependencies.md';

# Quickstart

This guide demostrates how to get a minimal Responsive environment set up and
running. The example use case implements the open source [Kafka Streams Demo 
Application](https://kafka.apache.org/documentation/streams/quickstart) on
the Responsive platform.

:::info

Currently, this quickstart only covers the compute functionality of the 
Responsive Platform. Autoscaling is only available in our managed cloud
offering.

:::

## Prerequisites

You will need Docker Compose, which you can install by following the [Docker
Compose documentation](https://docs.docker.com/compose/install/). To check if
you have it installed, run:

```
docker compose version
```

You should see an output resembling `Docker Compose version v2.19.1`.

## Deploy Kafka & Scylla

Responsive for Kafka Streams requires a Kafka broker and a storage backend
compatible with Apache Cassandra. In this quickstart, we will spin up 
`confluentinc/cp-kafka` and `scylladb/scylla` conatiners. 

1. Copy and paste the following YAML content into a file named 
  `docker-compse.yaml`:

   <details>
    <summary>
    Docker Compose YAML
    </summary>

    ```yaml title="docker-compose.yml" showLineNumbers
    ---
    version: '3'
    services:
      zookeeper:
        image: confluentinc/cp-zookeeper:7.3.0
        container_name: zookeeper
        environment:
          ZOOKEEPER_CLIENT_PORT: 2181
          ZOOKEEPER_TICK_TIME: 2000

      broker:
        image: confluentinc/cp-kafka:7.3.0
        container_name: broker
        ports:
        # To learn about configuring Kafka for access across networks see
        # https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/
          - "9092:9092"
        depends_on:
          - zookeeper
        environment:
          KAFKA_BROKER_ID: 1
          KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
          KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
          KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://broker:29092
          KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
          KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
          KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
          KAFKA_LOG_RETENTION_CHECK_INTERVAL_MS: 1000

      scylla:
        image: scylladb/scylla:latest
        container_name: scylla
        ports:
          - "9042:9042"
    ```
  </details>

2. Run the `docker-compse.yaml` file:
  ```bash
  $ docker compose up -d
  [+] Running 3/3
   ✔ Container scylla     Started                                                0.2s
   ✔ Container zookeeper  Started                                                0.2s
   ✔ Container broker     Started                                                0.4s

  ```

3. Initialize Scylla by creating a `KEYSPACE` to use for this quickstart:
  ```bash
  docker exec scylla cqlsh -e \
    "CREATE KEYSPACE quickstart \
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};"

  ```

## Add Responsive Dependencies

This section covers adding the required dependencies to an existing Java
development environment. If you do not already have one, you can follow
the [Maven Quickstart Archetype](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) 
or the [Gradle Quickstart](https://docs.gradle.org/current/userguide/part1_gradle_init.html) 
to initialize your project.

<PartialDependencies />

## Implement Word Count

This part of the quickstart will walk you through implementing a simple Kafka
Streams "Word Count" application that runs on Responsive. 

### Streams Topology

Take a look at the code below, which constructs the topology:

```java showLineNumbers
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> textLines = builder.stream("plaintext-input");
KTable<String, Long> wordCounts = textLines
    .flatMapValues(textLine -> Arrays.asList(textLine.toLowerCase().split("\\W+")))
    .groupBy((key, word) -> word)
    // highlight-next-line
    .count(ResponsiveStores.materialized(ResponsiveKeyValueParams.keyValue("counts-store")));
wordCounts
    .toStream()
    .to("wordcount-output", Produced.with(Serdes.String(), Serdes.Long()));
```

If you are familiar with Kafka Streams, you should feel right at home. The 
only difference is on line 6 (highlighted), where we specifically indicate
that the state store should be materialized using the Responsive state
implementaiton.

### Creating the Application

Instead of using the `KafkaStreams#new(Topology, Map<?,?>)` method to construct
your Kafka Streams instance, use the factory method on `ResponsiveKafkaStreams`
as shown below:

```java showLineNumbers
    Properties props = new Properties();
    // ...

    // highlight-next-line
    KafkaStreams streams = ResponsiveKafkaStreams.create(builder.build(), props);
    streams.start();
```


### Full Code

You can either copy the code snippet below into your own Java project, or
you can clone the code using:

```bash
# TODO: this repository doesn't exist yet
git clone https://github.com/responsivedev/quickstart.git
```

<details>
  <summary>
  Toggle the Full Code Snippet
  </summary>

  ```java title="ResponsiveWordCountApplication.java" showLineNumbers
  import dev.responsive.kafka.api.ResponsiveKafkaStreams;
  import dev.responsive.kafka.api.ResponsiveKeyValueParams;
  import dev.responsive.kafka.api.ResponsiveStores;
  import dev.responsive.kafka.config.ResponsiveConfig;
  import java.util.Arrays;
  import java.util.Properties;
  import org.apache.kafka.common.serialization.Serdes;
  import org.apache.kafka.streams.KafkaStreams;
  import org.apache.kafka.streams.StreamsBuilder;
  import org.apache.kafka.streams.StreamsConfig;
  import org.apache.kafka.streams.kstream.KStream;
  import org.apache.kafka.streams.kstream.KTable;
  import org.apache.kafka.streams.kstream.Produced;


  public class ResponsiveWordCountApplication {
    public static void main(final String[] args) throws Exception {
      Properties props = new Properties();

      // Kafka Streams Configs
      props.put(StreamsConfig.APPLICATION_ID_CONFIG, "wordcount-application");
      props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
      props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
      props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

      // Responsive Configs
      props.put(ResponsiveConfig.STORAGE_HOSTNAME_CONFIG, "localhost");
      props.put(ResponsiveConfig.STORAGE_PORT_CONFIG, "9042");
      props.put(ResponsiveConfig.STORAGE_DATACENTER_CONFIG, "datacenter1");
      props.put(ResponsiveConfig.TENANT_ID_CONFIG, "quickstart");

      StreamsBuilder builder = new StreamsBuilder();
      KStream<String, String> textLines = builder.stream(plaintext-input");
      KTable<String, Long> wordCounts = textLines
          .flatMapValues(textLine -> Arrays.asList(textLine.toLowerCase().split("\\W+")))
          .groupBy((key, word) -> word)
          .count(ResponsiveStores.materialized(ResponsiveKeyValueParams.keyValue("counts-store")));
      wordCounts
          .toStream()
          .to("wordcount-output", Produced.with(Serdes.String(), Serdes.Long()));

      KafkaStreams streams = ResponsiveKafkaStreams.create(builder.build(), props);
      streams.start();
    }
  }
  ```
</details>

## Run Word Count

This section will guide you through creating the Kafka topics, producing data,
running the Responsive Kafka Streams Application and finally consuming data.

1. Create the source topic:

```bash
docker exec broker /bin/kafka-topics --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic plaintext-input
```

2. Run the `WordCountApplication` class:

<Tabs groupId="build-system">
  <TabItem value="maven" label="Maven" default>

  ```bash
  mvn exec:java -Dexec.mainClass="dev.responsive.quickstart.WordCountApplication"
  ```
  </TabItem>
  <TabItem value="gradle" label="Gradle">

  ```bash
  ./gradlew :quickstart:WordCountApplication.main()
  ```
  </TabItem>
</Tabs>

3. Produce source data to the `plaintext-input` topic:

```bash
docker exec -it broker /bin/kafka-console-producer \
    --bootstrap-server localhost:9092 \
    --topic plaintext-input
```
Type the following lines, hitting `<ENTER>` after each line:
```
all streams lead to kafka
hello kafka streams
```

4. Read the data from the output topic:

```bash
docker exec broker /bin/kafka-console-consumer --bootstrap-server localhost:9092 \
    --topic wordcount-output \
    --from-beginning \
    --formatter kafka.tools.DefaultMessageFormatter \
    --property print.key=true \
    --property print.value=true \
    --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer \
    --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer
```
Your output should resemble:
```
all	    1
streams	1
lead	1
to	    1
kafka	1
hello	1
kafka	2
streams	2
```

:::info
For an explanation on why there are multiple outputs for each key, read
the excellent Kafka Streams [documentation](https://kafka.apache.org/35/documentation/streams/quickstart)
:::

## Clean Up

When you're done playing around with the quickstart application, type `^C` 
to terminate the Streams application and terminate the Kafka Broker and
Scylla database by running:
```bash
docker compose down
```

## Next Steps

- [Learn more](/concepts/architecture) about the Responsive platform
- Read the detailed [migration guide](migrate-kafka-streams) to migrate
  from Kafka Streams
- See the full [API reference](/category/api-reference)
