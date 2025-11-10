# Instrumenting the `frontend` Service

Next up is the `frontend` service. It's written in Typescript, uses Node as runtime and NextJS as web framework for the frontend.

Typescript transpiles to Javascript, which is another dynamic programming language - thus, OTel zero-code instrumentation for Javascript again relies on _monkey patching_.

If you're interested in the specifics, you can take a look at the [sourcecode of the auto-instrumentation for Node](https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/packages/auto-instrumentations-node/src/register.ts#L31), which will provide several highly detailed traces for you later on.


## OpenTelemetry Javascript Zero-Code Instrumentation

Again, it's time for you to take a look at the [official docs](https://opentelemetry.io/docs/zero-code/js/) for the Javascript zero-code instrumentation libraries and try to find answers to the following questions:

- **How and when do you set up the zero-code instrumentation?**
- **How do you configure the to-be-instrumented application?**
- **Which libraries and frameworks are supported by the OTel zero-code instrumentation?**

## Instrumenting the `frontend` Service

Once you looked into the official docs, it is time to auto-instrument your `frontend` service. You can follow the checklist below, and see how far you get. Fast-forward instructions can be found at the end of the lab.

- Install and bootstrap the necessary OpenTelemetry packages in `frontend/Dockerfile`
- Build the new version of the `frontend` service:
   ```sh
   docker compose build frontend
    ```
- Configure the auto-instrumentation by setting the needed environment variables in `compose.yml`. You want to set the service name to `frontend` and emit traces and metrics signals to `console` for now. You will also have to set the `NODE_OPTIONS` variable to its correct value.
- Restart the demo application:
   ```sh
   docker compose up -d --force-recreate frontend
    ```

### Inspecting the Auto-Instrumented Service

The auto-instrumentation of Node along with other frequently used packages of the Javascript ecosystem allows the OTel libraries to generate lots of spans throughout your requests to the frontend. You can view them like this:

```sh
docker compose logs -f frontend
```

Keep interacting with the demo application. You can spot the traces (and metrics) being generated and pushed to the console in near-realtime, again.

### Fast-forward

In case you couldn't finish the lab in time or there were problems configuring the auto-instrumentation, you can follow the instructions below to fast-forward your workshop environment to the desired state - feel free to check the outputs of the `frontend` service for traces and metrics after the commands have been executed successfully.


```sh
git checkout lab-3
docker compose build frontend
docker compose up -d --force-recreate frontend
```

