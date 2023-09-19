# Responsive Policies

You define a policy as a k8s custom resource (CR). The CR specification is provided below:

```
properties:
  spec:
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
        properties:
          maxReplicas:
            type: integer
          maxScaleUpReplicas:
            type: integer
          minReplicas:
            type: integer
          diagnosers:
            type: array
            items:
              properties:
                type:
                  enum:
                  - PROCESSING_RATE_SCALE_UP
                  - PROCESSING_RATE_SCALE_DOWN
                  - EXPECTED_LATENCY
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
                      properties:
                        type:
                          enum:
                          - FIXED_REPLICA
                          - RATE_BASED
                          - SCALE_TO_MAX
                          type: string
                        fixedReplica:
                          properties:
                            replicas:
                              type: integer
                          type: object
                      type: object
                  type: object
                processingRateScaleDown:
                  properties:
                    rate:
                      type: integer
                    windowMs:
                      type: integer
                  type: object
                processingRateScaleUp:
                  properties:
                    rate:
                      type: integer
                    windowMs:
                      type: integer
                  type: object
                threadSaturation:
                  properties:
                    threshold:
                      type: number
                    windowSeconds:
                      type: integer
                  type: object
              type: object
        type: object
    type: object
type: object
```

The following tables define what each of these fields means.

## Responsive Policy Specs 

Scope: `spec`

| Full Field Name           | Description                                                                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spec                      | The Responsive Policy specification                                                                                                                                            |
| spec.applicationName      | The name of your application's deployment/statefulset.                                                                                                                         |
| spec.applicationNamespace | The k8s namespace that your application is deployed into.                                                                                                                      |
| spec.status               | Set to POLICY_STATUS_MANAGED to have the Operator automatically execute corrective actions. Set to POLICY_STATUS_DISABLED to have the policy evaluate but not execute actions. |
| spec.policyType           | The type of application under management. Must be set to KAFKA_STREAMS.                                                                                                        |
| spec.kafkaStreamsPolicy   | Defines the policy for a Kafka Streams application.                                                                                                                            |

## Kafka Streams Policies 

Scope: `spec.kafkaStreamsPolicy`

| Full Field Name                            | Description                                                                                                                                                                     |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spec.kafkaStreamsPolicy                    | Defines the policy for a Kafka Streams application.                                                                                                                             |
| spec.kafkaStreamsPolicy.maxReplicas        | Specifies a constraint on the maximum number of replicas. The policy will never scale the application past this max.                                                            |
| spec.kafkaStreamsPolicy.minReplicas        | Specifies a constraint on the minimum number of replicas. The policy will never scale below this min.                                                                           |
| spec.kafkaStreamsPolicy.maxScaleUpReplicas | Specifies a constraint on the maximum number of replicas the policy will add in a given evaluation                                                                              |
| spec.kafkaStreamsPolicy.diagnosers         | A list of diagnosers that govern the policy's behaviour. Diagnosers can produce conflicting actions. In that case, the diagnoser that comes first in the list takes precedence. |


## Policy Diagnosers

Scope: `spec.kafkaStreamsPolicy.diagnoser[i]`

| Diagnoser Field Suffix <br/> Full Field Name: _spec.kafkaStreamsPolicy.diagnoser[i].SUFFIX_ | Description                                                                                                                                                                                                                                                                                                                                                                             |
|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type                                                                                        | Specifies the type of this diagnoser. One of PROCESSING_RATE_SCALE_UP, PROCESSING_RATE_SCALE_DOWN, EXPECTED_LATENCY, or THREAD_SATURATION.                                                                                                                                                                                                                                              |
| expectedLatency                                                                             | Specifies an Expected Latency Diagnoser. This Diagnoser specifies a goal for the expected latency for a record to be processed at a sub-topology, when enqueued at a source topic partition of that sub-topology.                                                                                                                                                                       |
| expectedLatency.maxExpectedLatencySeconds                                                   | The max expected latency for an application to be considered healthy.                                                                                                                                                                                                                                                                                                                   |
| expectedLatency.scaleDownBufferSeconds                                                      | If the application is violating the max expected latency goal, specifies how fast the diagnoser should try to bring the application back under the target expected latency. Specifying a lower value means the diagnoser will provision more replicas to try to more quickly meet the goal.                                                                                             |
| expectedLatency.windowSeconds                                                               | Specifies how long of a window to evaluate append and processing rates over to perform the expected latency calculation.                                                                                                                                                                                                                                                                |
| expectedLatency.scaleUpStrategy                                                             | Specifies a strategy to use to scale he application when violating the expected latency goal.                                                                                                                                                                                                                                                                                           |
| expectedLatency.scaleUpStrategy.type                                                        | One of FIXED_REPLICAS, SCALE_TO_MAX, or RATE_BASED. The FIXED_REPLICAS strategy will always scale up by a configurable number of replicas. The SCALE_TO_MAX strategy will always scale up to the max possible replicas. The RATE_BASED strategy will scale up to a number of replicas that meets the append rate while bringing the application back under the target expected latency. |
| expectedLatency.scaleUpStrategy.fixedReplicas.replicas                                      | Specifies the number of replicas to scale up by when using the FIXED_REPLICAS strategy.                                                                                                                                                                                                                                                                                                 |
| threadSaturation                                                                            | The Thread Saturation diagnoser tries to make sure that the application is making good use of the threads provisioned to process records. It does this by measuring how long each thread spends blocked waiting on new records to process vs processing records. If all the threads are spending most of their time blocked then it removes a replica.                                  |
| threadSaturation.threshold                                                                  | The threshold for blocked ratio over which to consider a thread "underutilized" and therefore removable.                                                                                                                                                                                                                                                                                |
| threadSaturation.windowSeconds                                                              | Specifies how long of a window to evaluate when computing blocked time.                                                                                                                                                                                                                                                                                                                 |
| processingRateScaleUp                                                                       | This diagnoser tries to ensure that all the nodes are processing fewer than some threshold of records per second. Whenever a node starts to exceed this threshold, it adds a replica.                                                                                                                                                                                                   |
| processingRateScaleUp.rate                                                                  | The rate over which to add a replica.                                                                                                                                                                                                                                                                                                                                                   |
| processingRateScaleDown                                                                     | This diagnoser tries to ensure that some node is processing more than some threshold of records per second. Whenever all the nodes dip below this threshold, it removes a replica.                                                                                                                                                                                                      |
| processingRateScaleDown.rate                                                                | The rate below which to remove a replica.                                                                                                                                                                                                                                                                                                                                               |

