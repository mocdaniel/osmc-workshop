Welcome to this OTel workshop! This repository contains the material and instructions to get you started with zero-code OTel instrumentation of applications.

You will need the following tools to work along:

- [Docker](https://docker.io)
- Git
- an environment that is capable of running ~10 containers in parallel

## How to Work Through This Workshop

If you're reading through this workshop on your own (without an instructor), the best way to go about it is like this:

1. Start with the slides (available [here](https://slides.dbodky.me/osmc-nuremberg-2025)). They provide introductory information about OpenTelemetry.
2. When you get to slides titled **Lab X: <Topic>**, switch to the corresponding page of the workshop instructions (the ones you're reading right now).
3. Once you are done with a lab, optionally follow the **fast-forward** instructions to prepare your environment for the next step.
4. Continue with the slides until you reach the next slide announcing a Lab.
5. Loop back to step 2 😉

## Final Preparations

Before you can start with the workshop, you need to build the Docker images containing the application's microservices.

For this, type the following commands:

```sh
cd ~/osmc-workshop
docker compose build
```

Building the images takes ~2 minutes on average. Have fun!
