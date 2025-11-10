# Application Auto-Instrumentation with Grafana Beyla

Now that you have successfully instrumented the OSMC Explorer application using some of the OpenTelemetry
auto-instrumentation SDKs, you can take a look at other solutions in the observability space.

We already covered eBPF and how it can be used to instrument applications that are otherwise hard to instrument.
[Grafana Beyla](https://grafana.com/oss/beyla-ebpf/?plcmt=oss-nav) takes this principle one step further by providing baseline instrumentation for many scenarios:

- captures metrics and traces
- auto-instruments applications written in multiple languages, e.g.:
  - Go
  - C/C++
  - Rust
  - Python
  - Ruby
  - Java
  - NodeJS
  - .NET
- enriches captured signals with information from container/Kubernetes environments
- provides auto-discovery capabilities for larger environments

> [!NOTE]
> Recently, Grafana Beyla has been donated to the OpenTelemetry project under the name _OpenTelemetry eBPF Instrumentation_
> (OBI).
> 
> Parts of the workshop have been created before this donation, and thus we will stick with Grafana Beyla, which is now a downstream project of OBI and continues to be actively maintained.

## Configuring Grafana Beyla

Beyla can be configured via environment variables or with a declarative configuration file written in YAML, which offers
more capabilities, e.g. in terms of service discovery. Since you will want to spin up just one instance of Beyla for instrumenting all microservices of the OSMC Explorer app, a YAML config file is the better option.

Take a look at [Beyla's configuration documentation section](https://grafana.com/docs/beyla/latest/configure/).

You want to find answer to two questions:

- How can you export captured traces/metrics to the OTel Collector already running in your workshop environment?
- How can you configure Beyla to only capture traces/metrics connected to the following information:
  - `talk-api` runs on port `8080`
  - `speaker-api` runs on port `5000`
  - `frontend` runs on port `3000`. As Grafana runs on the same port internally, you'll also want to specify the program that is running: `/usr/local/bin/node`

In addition, take a look at the [Docker Compose example](https://grafana.com/docs/beyla/latest/setup/docker/#docker-compose-example) to learn how to run Beyla along the other services in your workshop environment.

## Deploying Grafana Beyla

Once you answered the questions above, add a new service `beyla` for Beyla in your `compose.yml` with the information you found in the docs:

- make sure to run the Beyla service with `privileged: true`, so it can inject its eBPF probes
- make sure to run the Beyla service with `pid: host`, so it can pick up on the other services' processes

Then, adjust the existing services:

- Remove **all** `OTEL_*` environment variables from the services, **except for** `OTEL_SERVICE_NAME` - Beyla will pick up on this variable to set the service name on captured metrics/traces
- Remove the `go-auto` service, as you will instrument `talk-api` with Beyla instead
- Adjust the `Dockerfile` of `speaker-api` and `frontend` and remove the installation of the OTel auto-instrumentation SDKs
- Build the adjusted version of `speaker-api` and `frontend`:
   ```sh
   docker compose build frontend speaker-api
    ```
- Once you did all the necessary changes, redeploy the workshop environment, including the underlying storage:
   ```sh
   docker compose down --volumes --remove-orphans
   docker compose up -d
    ```


> [!NOTE]
> Instead of _removing_ the relevant parts from `compose.yml` and the `Dockerfiles`, you can _comment_ them out as well.
> 
> This way you can still take a look at how you got to the current state of your environment later on.

## Validate Beyla is Working Correctly

Once the environment has been redeployed successfully, you can check if Beyla is running correctly:

```sh
docker compose logs beyla | grep "instrumenting process"
```

You should see three log lines - one for each service. After interacting with the OSMC Explorer app and waiting a few seconds,
captured signals should start showing up in Grafana.

Take your time and explore the captured metrics and traces. **Can you spot any differences compared to the
auto-instrumentation you did before with the OTel auto-instrumentation SDKs?**

## Fast-forward

In case you couldn't finish the lab in time or there were problems configuring Beyla, you can follow the instructions below to fast-forward your workshop environment to the desired state - feel free to return to the checklist above and issue the
commands to check if everything is working correctly.


```sh
git checkout lab-6
docker compose down --volumes --remove-orphans
docker compose up -d 
```

