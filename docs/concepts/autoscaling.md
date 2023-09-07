---
sidebar_position: 4
---

# Autoscaling

## Overview

Responsive automatically manages your applications to meet changing workload demands. You simply define a policy that specifies health goals for the application. The Responsive Controller combines the policy with metrics and status updates from the application and Responsive Operator to decide how to keep your cluster healthy. Then, it coordinates with the application and Responsive Operator to automatically execute remediating actions.

## Architecture

![Controller Architecture](/img/control-architecture.png "Control Architecture")

You define a policy in a k8s custom resource (link to ref). The scaling policy defines a set of Diagnosers. A Diagnoser describes some health goals (e.g. keep latency low, keep utilization high) and constraints (dont scale past 10 replicas). Different diagnosers have different goals. For example, one diagnoser may have a goal of minimizing latency, while another diagnoser may have a goal of keeping utilization over some threshold. In conjunction, they define how to keep the cluster sized "just right" - large enough to keep up with your workload but keeping costs contained.

Each instance of the policy specifies how to manage a single application. The policy spec references the Deployment or Statefulset resource that defines your application.

You also install and run the Responsive Operator in your k8s cluster. It monitors the installed policies and the applications they point to, and updates the Responsive Controller with the current policy spec and status of the applications.

The Responsive Controller is responsible for making sure that your applications are meeting the health goals specified in your policies. It runs in Responsive Cloud. The application sends the Responsive controller metrics relevant to policy evaluation, for example the current processing rates and the consumer lag. The controller combines these metrics with the policy spec and application status sent by Operator to decide whether the application meets the health goals defined in the policy. If it doesn't, or will soon likely violate those goals it coordinates with the Operator and/or the application to execute some remediating action, like changing the number of replicas in your application's Deployment or StatefulSet, or changing the task assignment.
