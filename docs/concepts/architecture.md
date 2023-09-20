---
sidebar_position: 1
---

# Architecture

## Overview
Responsive is a platform for running stateful, reactive, backend applications. 
Responsive adopts a two layered architecture:

1. An event processing runtime that is embedded in your application. Today, Responsive ships open source [Kafka Streams](https://kafka.apache.org/documentation/streams/) as its event processing runtime. 
2. A set of backing services to support your Kafka Streams applications. Today, we offer a managed [storage service](storage) to act as remote state stores, and a controller service combined with a kubernetes operator to enable [autoscaling](autoscaling) your Kafka Streams applications.

## How it fits together
![The responsive architecture consists of managed storage and control plane components, and a Kafka Streams runtime embedded in your app](/img/responsive-architecture.png "Responsive Architecture")

1. Your Kafka Streams app continues to run in your environment as-is. You just need to pull in the Responsive client and swap `KafkaStreams` with `ResponsiveKafkaStreams` as documented in our [migration guide](../getting-started/migrate-kafka-streams).
2. With Responsive, your state stores are fully managed by us. This makes your Kafka Streams pods stateless, and means that you don't have to worry about managing RocksDB, waiting for restores from changelogs, and the like.
3. Your Kafka Streams app will periodically send metrics to the Responsive Controller, also managed by us. Based on the metrics and your policy, the controller will send scale up and scale down commands to the Responsive Operator, hosted in your kubernetes cluster. This means you no longer need to worry about application sizing and bursty traffic: we will find the optimal size for your apps and scale you transparently. 

In the future, we intend to introduce another runtime, in addition to Kafka Streams in order to offer 
these rich reactive APIs in multiple languages. Our intent is to use the same underlying platform and 
architecture to power the new runtime.

