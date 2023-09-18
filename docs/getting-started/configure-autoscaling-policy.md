---
sidebar_position: 4
---

# Configure Responsive Policy

This doc shows you how to configure a basic management policy for an application.
There are many policy knobs not covered by this document. To see a full specification
of everything you can configure, refer to the
[Responsive Policies](../reference/scaling-policies) reference.

## Prerequisites

Make sure you have the following environment variables set.

| Environment Variable | Description |
| `APPLICATION_NAME` | The k8s name of your application's Deployment or StatefulSet |
| `APPLICATION_NAMESPACE` | The k8s namespace your application is deployed into. |

## Defining and Deploying A Policy.

You specify a policy as a k8s Custom Resource. To define an example policy that tries
to ensure your application's processing latency is kept under 1 minute, run:

```
$ echo "apiVersion: \"application.responsive.dev/v1\"
kind: \"ResponsivePolicy\"
metadata:
  name: ${APPLICATION_NAME}
  namespace: ${APPLICATION_NAMESPACE}
spec:
  applicationNamespace: ${APPLICATION_NAMESPACE}
  applicationName: ${APPLICATION_NAME}
  status: POLICY_STATUS_MANAGED
  policyType: KAFKA_STREAMS
  kafkaStreamsPolicy:
    maxReplicas: 3
    diagnosers:
      - type: EXPECTED_LATENCY
        expectedLatency:
          maxExpectedLatencySeconds: 60
          scaleUpStrategy:
             type: RATE_BASED
      - type: THREAD_SATURATION
        threadSaturation:
          threshold: .65
" >> policy.yaml
```

Then, to apply the policy:
```
$ kubectl apply -f policy.yaml
```
