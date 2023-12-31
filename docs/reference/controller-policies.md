# Controller Policies

:::info

This page goes over the full policy specification for autoscaling with Responsive,
including the set of required specs and the full list of available configuration
options.

:::

## Custom Resource Specification

You define a policy as a k8s custom resource (CR).
See [Configure Controller Policy](../getting-started/configure-controller-policy.md)
for instructions on how to create one and an example of a user-defined policy
that showcases some of the below configuration options.

The full CR specification is as follows:

```
properties:
  type: object
  spec:
    type: object
    properties:
      applicationName:
        type: string
      applicationNamespace:
        type: string
      policyType:
        enum:
        - KAFKA_STREAMS
        type: string
      status:
        enum:
        - POLICY_STATUS_MANAGED
        - POLICY_STATUS_DISABLED
        type: string
      kafkaStreamsPolicy:
        type: object
        properties:
          maxReplicas:
            type: integer
          maxScaleUpReplicas:
            type: integer
          minReplicas:
            type: integer
          diagnoser:
            type: array
            items:
              type: object
              properties:
                type:
                  enum:
                  - EXPECTED_LATENCY
                  - PROCESSING_RATE_SCALE_DOWN
                  - PROCESSING_RATE_SCALE_UP
                  - THREAD_SATURATION
                  type: string
                expectedLatency:
                  properties:
                    maxExpectedLatencySeconds:
                      type: integer
                    windowSeconds:
                      type: integer
                    scaleDownBufferSeconds:
                      type: integer
                    scaleUpStrategy:
                      type: object
                      properties:
                        type:
                          enum:
                          - FIXED_REPLICA
                          - RATE_BASED
                          - SCALE_TO_MAX
                          type: string
                        fixedReplica:
                          type: object
                          properties:
                            replicas:
                              type: integer
                  type: object
                processingRateScaleDown:
                  type: object
                  properties:
                    rate:
                      type: integer
                    windowMs:
                      type: integer
                processingRateScaleUp:
                  type: object
                  properties:
                    rate:
                      type: integer
                    windowMs:
                      type: integer
                threadSaturation:
                  type: object
                  properties:
                    threshold:
                      type: number
                    windowSeconds:
                      type: integer
```

## Policy Specs

The following tables define what each of the fields in the policy specification CR mean.


### Required Fields

Scope: `spec`

| Field Name                | Description                                                                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spec                      | The Responsive Policy specification.                                                                                                                                           |
| spec.applicationName      | The name of your application's deployment/statefulset.                                                                                                                         |
| spec.applicationNamespace | The k8s namespace that your application is deployed into.                                                                                                                      |
| spec.status               | Set to POLICY_STATUS_MANAGED to have the Operator automatically execute corrective actions. Set to POLICY_STATUS_DISABLED to have the policy evaluate but not execute actions. |
| spec.policyType           | The type of application under management. Must be set to KAFKA_STREAMS.                                                                                                        |


### Scaling Constraints 

Scope: `spec.kafkaStreamsPolicy`

| Field Name                            | Description                                                                                                          |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| kafkaStreamsPolicy                    | Defines the policy for a Kafka Streams application.                                                                  |
| kafkaStreamsPolicy.maxReplicas        | Specifies a constraint on the maximum number of replicas. The policy will never scale the application past this max. |
| kafkaStreamsPolicy.minReplicas        | Specifies a constraint on the minimum number of replicas. The policy will never scale below this min.                |
| kafkaStreamsPolicy.maxScaleUpReplicas | Specifies a constraint on the maximum number of replicas the policy will add in a given evaluation.                  |


### Policy Diagnosers

Responsive offers several types of policy diagnosers which govern how the autoscaler detects and 
responds to changes in the application environment. Multiple diagnosers can be used in parallel
and specified via the `diagnoser` list in the CR spec. This list will be evaluated in order in 
case of conflicting recommendations, with the diagnoser that appears earliest in the list being
given priority.


Scope: `spec.kafkaStreamsPolicy.diagnoser`

| Field Name        | Description                                                                                                                                                                     |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| diagnoser         | A list of diagnosers that govern the policy's behaviour. Diagnosers can produce conflicting actions. In that case, the diagnoser that comes first in the list takes precedence. |
| diagnoser[i].type | Specifies the type of this diagnoser. One of EXPECTED_LATENCY, PROCESSING_RATE_SCALE_DOWN, PROCESSING_RATE_SCALE_UP, or THREAD_SATURATION.                                      |


#### Policy Diagnoser Types

We currently offer four diagnoser types:
1. [Expected Latency](#expected-latency)
2. [Processing Rate: Scale Down](#processing-rate-scale-down)
3. [Processing Rate: Scale Up](#processing-rate-scale-up)
4. [Thread Saturation](#thread-saturation)

### Expected Latency

Type: `EXPECTED_LATENCY`

Scope: `spec.kafkaStreamsPolicy.diagnoser[i].expectedLatency`

| Field Name                                             | Description                                                                                                                                                                                                                                                                                                                                                                             |
|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| expectedLatency                                        | Specifies an Expected Latency Diagnoser. This Diagnoser specifies a goal for the expected latency for a record to be processed at a sub-topology, when enqueued at a source topic partition of that sub-topology.                                                                                                                                                                       |
| expectedLatency.maxExpectedLatencySeconds              | The max expected latency for an application to be considered healthy.                                                                                                                                                                                                                                                                                                                   |
| expectedLatency.scaleDownBufferSeconds                 | If the application is violating the max expected latency goal, specifies how fast the diagnoser should try to bring the application back under the target expected latency. Specifying a lower value means the diagnoser will provision more replicas to try to more quickly meet the goal.                                                                                             |
| expectedLatency.windowSeconds                          | Specifies how long of a window to evaluate append and processing rates over to perform the expected latency calculation.                                                                                                                                                                                                                                                                |
| expectedLatency.scaleUpStrategy                        | Specifies a strategy to use to scale he application when violating the expected latency goal.                                                                                                                                                                                                                                                                                           |
| expectedLatency.scaleUpStrategy.type                   | One of FIXED_REPLICAS, SCALE_TO_MAX, or RATE_BASED. The FIXED_REPLICAS strategy will always scale up by a configurable number of replicas. The SCALE_TO_MAX strategy will always scale up to the max possible replicas. The RATE_BASED strategy will scale up to a number of replicas that meets the append rate while bringing the application back under the target expected latency. |
| expectedLatency.scaleUpStrategy.fixedReplicas.replicas | Specifies the number of replicas to scale up by when using the FIXED_REPLICAS strategy.                                                                                                                                                                                                                                                                                                 |


### Processing Rate: Scale Down

Type: `PROCESSING_RATE_SCALE_DOWN`

Scope: `spec.kafkaStreamsPolicy.diagnoser[i].processingRateScaleDown`

| Field Name                   | Description                                                                                                                                                                        |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| processingRateScaleDown      | This diagnoser tries to ensure that some node is processing more than some threshold of records per second. Whenever all the nodes dip below this threshold, it removes a replica. |
| processingRateScaleDown.rate | The rate below which to remove a replica.                                                                                                                                          |


### Processing Rate: Scale Up

Type: `PROCESSING_RATE_SCALE_UP`

Scope: `spec.kafkaStreamsPolicy.diagnoser[i].processingRateScaleUp`

| Field Name                 | Description                                                                                                                                                                           |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| processingRateScaleUp      | This diagnoser tries to ensure that all the nodes are processing fewer than some threshold of records per second. Whenever a node starts to exceed this threshold, it adds a replica. |
| processingRateScaleUp.rate | The rate over which to add a replica.                                                                                                                                                 |


### Thread Saturation

Type: `THREAD_SATURATION`

Scope: `spec.kafkaStreamsPolicy.diagnoser[i].threadSaturation`

| Field Name                     | Description                                                                                                                                                                                                                                                                                                                                            |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| threadSaturation               | The Thread Saturation diagnoser tries to make sure that the application is making good use of the threads provisioned to process records. It does this by measuring how long each thread spends blocked waiting on new records to process vs processing records. If all the threads are spending most of their time blocked then it removes a replica. |
| threadSaturation.threshold     | The threshold for blocked ratio over which to consider a thread "underutilized" and therefore removable.                                                                                                                                                                                                                                               |
| threadSaturation.windowSeconds | Specifies how long of a window to evaluate when computing blocked time.                                                                                                                                                                                                                                                                                |

