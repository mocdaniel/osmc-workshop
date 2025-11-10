# Instrumenting the `talk-api` Service

The only service you still need to implement is the `talk-api` microservice, written in Go.

Go differs from Python and Javascript as it is not a dynamic programming language. Instead of the application
code being interpreted at runtime, it gets compiled and executed as a binary. This means that the approach of monkey
patching doesn't work.

Instead, the OpenTelemetry zero-code auto-instrumentation for Go approaches the task using [eBPF](https://ebpf.io).

## eBPF in Three Sentences

eBPF, as an evolution of BPF (Berkeley Packet Filter), enables you to write small programs that compile to bytecode and get
injected into the OS kernel, attaching themselves to specific entrypoints (e.g. tracepoints or syscalls).

At injection time, OS kernel mechanisms ensure that an eBPF probe is secure, not overly complex, and follows configurable constraints in size.

This approach of instrumenting the OS kernel itself has gained adoption in the networking, security, and observability space in recent years,
e.g. for cloud-native software like [Cilium](https://cilium.io) or [Falco](https://falco.org).

## OpenTelemetry Go Zero-Code Instrumentation

For the last time (promise!), take a look at the OTel docs - this time for the
[Go auto-instrumentation](https://opentelemetry.io/docs/zero-code/go/).

As you can see, this particular project within the OTel ecosystem is still considered a **work in progress**, and the docs link to its GitHub repository.

Take a look around the repository, especially the **Getting Started** section, and - again - try to answer the following questions:

- **How and when do you set up the zero-code instrumentation?**
- **How do you configure the instrumentation?**

## Instrumenting the `talk-api` Service

Once you concluded your initial research, you can again follow the checklist below to instrument your `talk-api` service.

- Add a new service for the Go auto-instrumentation to `compose.yml`. You can use the following skeleton:
   ```yaml
   go-auto:
     depends_on:
       - talk-api
     image: otel/autoinstrumentation-go:v0.23.0
     privileged: true
     pid: "host"
     environment:
       OTEL_GO_AUTO_TARGET_EXE: /app/talk-api
       OTEL_SERVICE_NAME: talk-api
       OTEL_TRACES_EXPORTER: console
     volumes:
       - /proc:/host/proc
    ```
- Restart the OSMC Explorer applications:
   ```sh
   cd ~/osmc-workshop
   docker compose up -d go-auto
    ```

### Inspecting the Auto-Instrumented Service

Similar to the `speaker-api` you already instrumented, the `go-auto` instrumentation service should now emit a trace(span) per HTTP request issued against the `talk-api` service once you interact with the OSMC Explorer app via its frontend:

```sh
docker compose logs -f go-auto
```

Keep interacting with the demo application. You can again spot the traces being generated and pushed to the console in near-realtime.

### Fast-forward

In case you couldn't finish the lab in time or there were problems configuring the auto-instrumentation, you can follow the instructions below to fast-forward your workshop environment to the desired state - feel free to check the outputs of the `go-auto` service for traces and metrics after the commands have been executed successfully.


```sh
git checkout lab-4
docker compose up -d go-auto
```

