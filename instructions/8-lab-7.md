# Generating Synthetic OTel Signals

When exploring telemetry signals in Grafana, some graphs might show **No data** at times. This is especially true for **Drilldown views** and
imported, prebuilt dashboards.

The reason for this in many cases is Grafana's special `$__rate_interval` variable that gets computed based on a dashboard's time range and
normally results in well-composed graphs - if you collected enough data.

In demo or test environments, this is often not the case - it can be difficult to manually interact with services in a way that triggers the generation
of enough metrics, logs, and traces.

**So how to test OTel setups and pipelines?**

## Synthetic load tests with Grafana k6

[Grafana k6](https://k6.io) is a handy tool that allows you to define load/performance/browser tests as code in Javascript. You can define
multiple scenarios, worker pools, and thresholds that your application(s) need to meet.

A very simple k6 script could look like this:

```js
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 5,          // number of virtual users
  duration: '5m',  // how long the test should run
};

const BASE_URL = 'http://your-app:3000';

export default function () {
  const endpoints = [
    '/',               // homepage
    '/api/health',     // health check
    '/api/items',      // list
    '/api/items/1',    // item detail
  ];

  // Pick a random endpoint for each iteration
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

  http.get(`${BASE_URL}${endpoint}`);
  sleep(1); // think-time to avoid unrealistic amounts of requests
}
```

You will use k6 to synthetically trigger the creation of more meaningful and diverse OTel signals than would be feasible by manually interacting with the OSMC Explorer app.

For this, a k6 script is provided in your workshop environment at `configs/k6.js`:

Even if you're not familiar with Javascript, you should be able to identify a few details of the script:

- k6 creates 10 virtual users
- k6 will run for 90 minutes
- k6 will test all services explicitly:
  - `frontend`
  - `speaker-api`
  - `talk-api`
- k6 will test _happy paths_ and _unhappy paths_ (leading to errors) for each service, based on their API contracts

Feel free to tweak a few parameters if you want to test a slightly different scenario.

Then, configure a new service `k6` in your `compose.yml`

```yaml
k6:
  image: grafana/k6:1.4.0
  depends_on:
    - frontend
    - speaker-api
    - talk-api
  volumes:
    - ./configs/k6.js:/k6.js
  command: ["run", "/k6.js"]
```

Finally, spin up k6 and let it start its load tests:

```sh
docker compose up -d k6
```

## Fast-forward

In case you couldn't finish the lab in time or there were problems configuring k6, you can follow the instructions below to fast-forward your workshop environment to the desired state.


```sh
git checkout lab-7
docker compose up -d k6
```

