# Collecting and Storing Telemetry Data

Now that you've _instrumented_ your various microservices and verified that they indeed emit OTel signals,
it's time to **collect** and **store** those signals somewhere to be of further use.

For this, the OpenTelemetry project provides the OTel Collector.

## The OTel Collector

The [OTel Collector](https://github.com/open-telemetry/opentelemetry-collector) is a single binary that can:

- **receive** and/or **fetch** OTel signals from various sources
- **process** them (batching/sampling/transforming it)
- **export** the resulting signals to various destinations (e.g. Prometheus, Tempo, or Loki)

The OTel Collector is configured via a YAML-formatted configuration file that defines all the `receivers`, `processors`, and `exporters` that make up the `pipelines` defined in this workshop.

Let's have a look at the OTel Collector config provided for this workshop in `configs/otel-collector-config.yaml`.

As you can see, the following components are defined for the collector's pipelines:

- **1 receiver:** An `otlp` receiver accepting OTLP-formatted signals via gRPC (port `4317`) or protobuf (port `4318`)
- **1 processor:** The `batch` processor compresses data and reduces the number of outgoing connections
- **3 exporters**:
  - `otlp/tempo` exports OTLP-formatted trace signals to a [Tempo](https://grafana.com/oss/tempo/?plcmt=oss-nav) instance for long-time storage
  - `otlphttp/prometheus` exports OTLP-formatted metric signals to a [Prometheus](https://prometheus.io) instance for long-time storage
  - `debug` logs summaries of received signals to the collector's console for you to know _what's happening_

These components are combined to create the pipelines the received OTel signals will be processed in before being exported again. You can learn more about the available components by inspecting the `exporter/`, `receiver/` and `processor/` directories in the collector's [GitHub repository](https://github.com/open-telemetry/opentelemetry-collector-contrib).

> [!NOTE]
> There's a great online tool available for **exploring, visualizing**, and **validating** OTel Collector configurations: [otelbin.io](https://otelbin.io).
>
> Feel free to try it out with the OTel Collector config from your workshop environment!

## Configuring the Microservices

In order to _receive_ OTel signals from your microservices with the OTel Collector, you must configure them to _export_ the generated signals (metrics and/or traces) to your collector.

This can be done by setting the environment variable `OTEL_EXPORTER_OTLP_ENDPOINT` to the endpoint of your OTel collector, and adjusting `OTEL_TRACES_EXPORTER` and/or `OTEL_METRICS_EXPORTER` to also export to `otlp` in addition to `console`.

As per usual, below is a checklist for you to work through and try to configure your microservices to export OTel signals to your OTel collector:

- Adjust the `talk-api` instrumentation to send signals to `http://otel-collector:4318`
- Adjust the `speaker-api` instrumentation to send signals to `http://otel-collector:4317`
- Adjust the `frontend` instrumentation to send signals to `http://otel-collector:4318`
- Adjust the instrumentation for `speaker-api` and `frontend` to _also_ export OTel signals via `otlp`
- Adjust the instrumentation for `talk-api` to **only** export OTel signals via `otlp` (as multiple exports aren't supported)
- Restart the demo app environment:
   ```sh
   docker compose up -d --force-recreate
     ```

> [!NOTE]
> The difference in endpoints is due to the varying **default protocols** the auto-instrumentation packages use for exporting OTel signals: Some use gRPC (on port 4317), others use protobuf (on port 4318)

## Exploring the collected OTel Signals

Once everything is up and running again, interact with the OSMC Explorer app to trigger the creation of OTel signals.

Then, check the logs of the OTel Collector to validate that signals are being received, processed, and exported:

```sh
docker compose logs otel-collector
```

### Exploring Traces in Grafana Explore

Next, inspect the collected traces in Grafana, which is running at [http://localhost:3001](http://localhost:3001). In the **Explore** view, you can search for collected trace spans by service, detected trace name, and much more. You should be able to notice that you always end up with traces spanning multiple microservices - you managed to setup **distributed tracing** for the OSMC Explorer app!

### Exploring Metrics in Grafana Drilldown

With OTel, you often get lots of different metrics and trace spans per default - a great way to explore the data you collect is via **Grafana Drilldown**. Let's take a look at the collected metrics there.

First, navigate to **Drilldown > Metrics** in Grafana. You should see a long list of graphs - Grafana will identify your time series' metrics type (e.g. `sum` or `histogram`) and automatically render a fitting graph.

> [!NOTE]
> If many of the graphs display `No data`, that's due to the usage of `$__rate_interval` within Grafana's dashboard panels.
>
> Try adjusting the dashboard's **time range** in the top right, e.g. to **Last 24 hours**.

Once you got an overview, _drill down_ one of the metrics by clicking on **Select**. A new view should come up with the main graph in the top, and a multitude of possible _breakdowns_ below.

These breakdowns are according to different metric attributes, e.g. `http_request_method` or `http_response_status_code`.

This makes it easy to drill down further, e.g. to see the `http_client_request_duration` across different `http_response_status_code` values.

### Fast-forward

In case you couldn't finish the lab in time or there were problems configuring the auto-instrumentation, you can follow the instructions below to fast-forward your workshop environment to the desired state - feel free to explore Grafana, especiall the **Explore** and **Drilldown > Metrics** views after setting everything up.


```sh
git checkout lab-5
docker compose up -d
```

