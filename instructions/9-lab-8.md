# BONUS: All-in-one OTel Setups with Grafana Alloy

By now, you've configured OTel auto-instrumentation SDKs and Grafana Beyla, set up k6 to validate your OTel processing is working correctly,
and visualized the results in Grafana. 

Let's imagine for a moment that your demo app scales to production-grade. This could mean multiple hosts, maybe Kubernetes as a container runtime,
and a higher cost of maintenance for (auto-)instrumenting your applications.

You already leveraged Beyla to get baseline distributed traces and RED metrics for your applications automatically, but what if you need to install
and maintain Beyla on 10 hosts? What about collecting the generated OTel signals? And how would you validate that all these configurations work as intended?

## Grafana Alloy - A Big Tent OTel Collector Distribution

[Grafana Alloy](https://grafana.com/oss/alloy-opentelemetry-collector/?plcmt=oss-nav) is Grafana's OTel Collector Distribution, i.e. a downstream project consuming the OTel Collector's configuration and enriching it with
additional capabilities or configuration.

In Alloy's case, some of those features are:

- its own DSL for configuring programmable pipelines
- a web-based UI with live-debugging capabilities
- many builtin components, e.g. many Prometheus exporter or Grafana Beyla

In this final lab of the workshop, you are going to configure and deploy Grafana Alloy the same way as you did with the OTel Collector before. In the process, you will take a look at Alloy's
debugging UI, its DSL, and a few of its builtin features.

## Converting the OTel Collector Config

Since Alloy comes with its own DSL, there's a handy CLI command that lets you migrate many OTel Collector configs into Alloy's DSL format, which is called _River_:

```sh
docker run --rm -v /$PWD/configs/otel-collector-config.yaml:/config.yaml \
  grafana/alloy:v1.11.3 convert -f otelcol /config.yaml > ./configs/config.alloy
```

You should end up with a new Alloy config in `configs/config.alloy`. Take a look at it and see how the OTel Collector config translates into Alloy DSL!


## Configuring the Builtin Beyla 

Next, you need to configure Beyla, which is available as the `beyla.ebpf` component in Alloy's DSL. Try to convert the config file in `configs/beyla.yml` by inspecting
[the `beyla.ebpf` docs for Alloy](https://grafana.com/docs/alloy/latest/reference/components/beyla/beyla.ebpf/) and mapping the respective sections of the config.

Make sure to set `outputs` for `traces` to forward collected signals to the `batch` processor in Alloy's config, similar to the other components already present in the converted config.

Additionally, make sure to scrape Beyla's metrics endpoint to collect the captured `metrics`.

> [!NOTE]
> There are examples for both, metrics and traces collection with builtin Beyla in [Alloy's component docs](https://grafana.com/docs/alloy/latest/reference/components/beyla/beyla.ebpf/#examples-1).

## Enabling Live Debugging

**Live debugging**, one of Alloy's most useful features, needs to be enabled explicitly.

Copy this component definition and paste it into `configs/config.alloy`:

```hcl
livedebugging {
  enabled = true
}
```

## Deploying Alloy

Finally, add this service definition to your `compose.yml`:

```yaml
alloy:
  image: grafana/alloy:v1.11.3
  depends_on:
    - speaker-api
    - talk-api
    - frontend
  privileged: true
  pid: host
  command:
    - run
    - --server.http.listen-addr=0.0.0.0:12345
    - --stability.level=experimental
    - /etc/alloy/config.alloy
  ports:
    - "12345:12345"
  volumes:
    - ./configs/config.alloy:/etc/alloy/config.alloy
```

Then, shut down the `beyla` and `otel-collector` services and start `alloy` instead:

```sh
docker compose down beyla otel-collector
docker compose up -d alloy
```

## Exploring Alloy

Access Alloy at [http://localhost:12345](http://localhost:12345). You see an overview of all configured components. A click on any of the components will take you to a detail view, displaying the component's configuration as well as the entrypoint for live-debugging (if available).

Alternatively, you can also see your configured pipelines visualized as graph, with color-coded, real-time insights on the OTel signals flowing through the pipelines.

## Fast-forward

In case you couldn't finish the lab in time or there were problems configuring and deploying Alloy, you can follow the instructions below to fast-forward your workshop environment to the desired state.


```sh
git checkout lab-8
docker compose down beyla otel-collector
docker compose up -d alloy
```

