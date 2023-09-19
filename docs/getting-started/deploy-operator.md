---
sidebar_position: 3
---

# Deploy Kubernetes Operator

This documentation covers how to set up the communication between your client
application and the Responsive control plane, as well as how to deploy the
operator in your kubernetes context.

## Prerequisites

The Responsive platform uses Open Telemetry to collect the metrics it needs to
make autoscaling decisions. You'll need the following information:

| Environment Variable   | Description                                                                                                                                                                                                                         |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PATH_TO_JAVA_LIBS`    | Configuring the open telemetry agent requires passing in the `javaagent` JAR. If you follow Step 1 above, this should be part of your Java `CLASSPATH` - check your container build to see where your JARs are placed.              |
| `PATH_TO_OTEL_JMX`     | Open Telemetry needs a JMX configuration to know which metrics to export to Responsive. You should put [this configuration file]( https://github.com/responsivedev/responsive-pub/blob/main/etc/otel-jmx.config.yaml) in that path. |
| `NAMESPACE`            | This is the namespace that your streams applications in kubernetes runs in.                                                                                                                                                         |
| `APPLICATION`          | This is the name of your streams application in kubernetes.                                                                                                                                                                         |
| `CONTROLLER_ENDPOINT`  | This is `https://<org-name>.ctl.us-west-2.aws.cloud.responsive.dev`(or the corresponding controller deployed in other regions)                                                                                                      |
| `API_KEY`/`API_SECRET` | These will be provided to you. We recommend you load these as environment variables through kubernetes secrets.                                                                                                                     |
| `ENVIRONMENT`          | A name for the environment in which the application runs. A good option here would be to use the name of the kubernetes cluster that runs the application.                                                                          |

Once you have the values for these, you should run your Kafka Streams with 
these additional arguments to configure the metrics collector:

```bash
-javaagent:${PATH_TO_JAVA_LIBS}/opentelemetry-javaagent-1.25.0.jar
-Dotel.metrics.exporter=otlp
-Dotel.service.name=${APPLICATION}-otel
-Dotel.jmx.config=${PATH_TO_OTEL_JMX}/otel-jmx.config.yaml
-Dotel.exporter.otlp.metrics.headers=api-key=${API_KEY},secret=${SECRET}
-Dotel.exporter.otlp.endpoint=${CONTROLLER_ENDPOINT}
-Dotel.exporter.otlp.metrics.endpoint=${CONTROLLER_ENDPOINT}
-Dotel.resource.attributes=responsiveApplicationId=${ENVIRONMENT}/${NAMESPACE}/${APPLICATION}
-Dotel.metric.export.interval=10000
```

## Deploy the Operator

### Setup

Install the Responsive Policy Custom Resource Definition (CRD) by pulling the
latest version and applying it to your Kubernetes cluster:

```bash
export RESPONSIVE_OPERATOR_VERSION=<insert the latest version here>
kubectl apply -f https://s3.amazonaws.com/crd.responsive.dev/responsive-operator/revisions/${RESPONSIVE_OPERATOR_VERSION}/crd.yml
```

Create a namespace for the operator, in this example `responsive`:
```bash
kubectl create namespace responsive
```

### Configure Secrets

Create a secret which loads the value of your Controller API key into the
Operator's pods:
```bash
export API_KEY=<insert your api key ID here>
export SECRET=<insert your api key secret here>
cat <<EOF >> secrets.properties
responsive.platform.api.key=${API_KEY}
responsive.platform.api.secret=${SECRET}
EOF
kubectl create secret generic --namespace responsive ctl-secret --from-file=secrets.properties
```

Create a secret which loads the value of your Kafka API key into the
Operator's pods:
```bash
$ export LOGGING_KAFKA_API_KEY=<insert your logging kafka api key ID here>
$ export LOGGING_KAFKA_SECRET=<insert your loggin kafka api key secret here>
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
$ export ORG_NAME=<your org name>
$ helm install responsive-operator oci://public.ecr.aws/j8q9y0n6/responsiveinc/charts/responsive-operator \
    --version ${RESPONSIVE_OPERATOR_VERSION} \
    --set controllerEndpoint=dns:///${ORG_NAME}.ctl.us-west-2.aws.cloud.responsive.dev \
    --set logging.kafka.keySecret=logging-kafka-secret \
    --set logging.kafka.endpoint=pkc-rgm37.us-west-2.aws.confluent.cloud:9092 \
    --set logging.kafka.topic=responsive.telemetry.logs.${ORG_NAME}.operator \
    --set operatorOpts="--environment=${ENVIRONMENT}"
    --namespace responsive
```

If this has worked, you should see the `responsive-operator` pod running
in your k8s `responsive` namespace:

```bash
kubectl get pods -n responsive
```

## Next Steps

- Configure your [autoscaling policies](configure-autoscaling-policy)
- Read up how how our [control plane works](../concepts/autoscaling)
