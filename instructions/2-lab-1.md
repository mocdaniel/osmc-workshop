Before you start instrumenting the OSMC Explorer application and start gaining insights into its behavior, you need
to get acquainted with it.

## Start the Demo Application

Bring up the OSMC Explorer application with the following command, then visit the **Frontend** at [http://localhost:3000](http://localhost:3000) the UI.

```sh
docker compose up -d
```

## Explore the Demo Application Logs

Once you interacted with the application, you can check out its logs. The OSMC Explorer application consists of three microservices, running in three Docker containers of the same name:

- `frontend`
- `talk-api`
- `speaker-api`

You can inspect each container's logs with the following command, inserting the respective container name:

```sh
docker compose logs <service_name>
```

> [!NOTE]
> By adding `-f` to the command, you can also **tail the logs** of a container while interacting with the UI
