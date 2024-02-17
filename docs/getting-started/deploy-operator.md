---
sidebar_position: 3
---

# Deploy Kubernetes Operator

This documentation covers how to set up the communication between your client
application and the Responsive control plane, as well as how to deploy the
operator in your kubernetes context.

## Application Prerequisites

Before deploying the Responsive operator, you'll need to make sure the Kafka Streams
application has the required configuration. The Responsive platform uses Open Telemetry
to collect the metrics it needs to make autoscaling decisions. You'll need to set the
following configs in your properties file (or however you pass configs into
`ResponsiveKafkaStreams`) using your Responsive api key and secret plus your 
organization name (`orgId`) and environment name (`env`):

```bash
responsive.controller.endpoint=https://<orgId>-<env>.ctl.us-west-2.aws.cloud.responsive.dev
responsive.metrics.enabled=true
responsive.metrics.api.key=<key>
responsive.metrics.secret=<secret>
```

## Deploy the Operator

### Setup

Install the Responsive Policy Custom Resource Definition (CRD) by pulling the
latest version and applying it to your Kubernetes cluster:

```bash
$ export RESPONSIVE_OPERATOR_VERSION=<insert the latest version here>
$ kubectl apply -f https://s3.amazonaws.com/crd.responsive.dev/responsive-operator/revisions/${RESPONSIVE_OPERATOR_VERSION}/crd.yml
```

Create a namespace for the operator, in this example `responsive`:
```bash
$ kubectl create namespace responsive
```

### Configure Secrets

Create a secret which loads the value of your Controller API key into the
Operator's pods:
```bash
$ export API_KEY=<insert your api key ID here>
$ export SECRET=<insert your api key secret here>
$ cat <<EOF >> secrets.properties
responsive.platform.api.key=${API_KEY}
responsive.platform.api.secret=${SECRET}
EOF
$ kubectl create secret generic --namespace responsive ctl-secret --from-file=secrets.properties
```

Create a secret which loads the value of your Kafka API key into the
Operator's pods:
```bash
$ export LOGGING_KAFKA_API_KEY=<insert your logging kafka api key ID here>
$ export LOGGING_KAFKA_SECRET=<insert your logging kafka api key secret here>
$ cat <<EOF >> key.properties
username=${LOGGING_KAFKA_API_KEY}
password=${LOGGING_KAFKA_SECRET}
EOF
$ kubectl create secret generic --namespace responsive logging-kafka-secret --from-file=key.properties
```

### Install via Helm

You will need to [install helm](https://helm.sh/docs/intro/install/) to apply
the CRD. Once that is installed, install the Operator Chart in your kubernetes
cluster:
```bash
$ export ORG_ID=<your org name>
$ export ENVIRONMENT=<your environment name>
$ helm install responsive-operator oci://public.ecr.aws/j8q9y0n6/responsiveinc/charts/responsive-operator \
    --version ${RESPONSIVE_OPERATOR_VERSION} \
    --set controllerEndpoint=dns:///${ORG_ID}-${ENVIRONMENT}.ctl.us-west-2.aws.cloud.responsive.dev \
    --set logging.kafka.keySecret=logging-kafka-secret \
    --set logging.kafka.endpoint=pkc-n98pk.us-west-2.aws.confluent.cloud:9092 \
    --set logging.kafka.topic=responsive.telemetry.logs.${ORG_ID}.operator \
    --set operatorOpts="-environment ${ENVIRONMENT}" \
    --namespace responsive
```

If this has worked, you should see the `responsive-operator` pod running
in your k8s `responsive` namespace:

```bash
$kubectl get pods -n responsive
```

## Next Steps

- Configure your [controller policies](configure-controller-policy) to enable autoscaling
- Read up on how our [control plane works](../concepts/autoscaling)
