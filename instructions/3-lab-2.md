# Instrumenting the `speaker-api` Service

Now that your demo application is running, it's time to start gaining insights. For this, you are going to **auto-instrument** the microservices one after the other. You will start by auto-instrumenting the `speaker-api` service, which is written in Python.

## Monkey Patching

OpenTelemetry auto-instrumentation for many _dynamic programming languages_ (such as Python) happens via [Monkey Patching](https://en.wikipedia.org/wiki/Monkey_patch).

Monkey Patching is the practice of dynamically modifying the runtime code of an application and its dependencies.
In the case of the OpenTelemetry auto-instrumentation SDKs, your application code gets modified dynamically so that it emits OTel signals.

You can take a look behind the scenes of this practice by inspecting the [auto-instrumentation code for Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-flask/src/opentelemetry/instrumentation/flask/__init__.py#L570), the web server used for serving the `speaker-api` microservice.

In this case, `_InstrumentedFlask` is a subclass of the original Flask class. Once it has been initialized, every Flask instance of your application code becomes an instrumented version of Flask, automatically.

The same principle can be observed for languages like **Javascript/Typescript** or **php**.

## OpenTelemetry Python Zero-Code Instrumentation

With this knowledge about how monkey patching works, it's time to take a look at how to setup and configure OTel zero-code instrumentation for Python applications.

Take a look at the [official docs](https://opentelemetry.io/docs/zero-code/python/) and pay attention to the following questions:

- **How and when do you set up the zero-code instrumentation?**
- **How do you configure the to-be-instrumented application?**
- **Which libraries and frameworks are supported by the OTel zero-code instrumentation?**

## Instrumenting the `speaker-api` Service

Once you looked into the official docs, it is time to auto-instrument your `speaker-api` service. You can follow the checklist below, and see how far you get. Fast-forward instructions can be found at the end of the lab.

- Install and bootstrap the necessary OpenTelemetry packages in `speaker-api/Dockerfile`
- Build the new version of the `speaker-api` service:
   ```sh
   docker compose build speaker-api
    ```
- Configure the auto-instrumentation by setting the needed environment variables in `compose.yml`. You want to set the service name to `speaker-api` and emit traces and metrics signals to `console` for now.
- Restart the demo application:
   ```sh
   docker compose up -d --force-recreate speaker-api
    ```

### Inspecting the Auto-Instrumented Service

Once the OSMC Explorer is up and running again, interact with it via the frontend. Then, go and check the logs of
the `speaker-api` service. If you instrumented and configured the service correctly, trace spans and metrics should show up in the console output:

```sh
cd ~/osmc-workshop
docker compose logs -f speaker-api
```

Keep interacting with the demo application. You can spot the traces (and metrics) being generated and pushed to the console in near-realtime.

### Fast-forward

In case you couldn't finish the lab in time or there were problems configuring the auto-instrumentation, you can follow the instructions below to fast-forward your workshop environment to the desired state - feel free to check the outputs of the `speaker-api` service for traces and metrics after the commands have been executed successfully.


```sh
git checkout lab-2
docker compose build speaker-api
docker compose up -d --force-recreate speaker-api
```

