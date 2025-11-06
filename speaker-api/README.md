
# Speaker API

A lightweight Flask microservice that provides hard‑coded speaker information for a conference application.

## Overview

- **Endpoints**
  - `GET /api/speakers` – Returns a list of all speakers (without the `bio` field).
  - `GET /api/speaker/{id}` – Returns full details for a single speaker, including `bio` and associated talk IDs.
- **Logging** – Every request is logged with method and path.
- **Testing** – Includes pytest tests covering both endpoints and error handling.
- **Docker** – Ready to run in a container.

## Prerequisites

- Python 3.12 (or any recent 3.x version)
- Docker (optional, for containerized deployment)

## Setup (local)

1. **Create a virtual environment** (recommended)

   ```bash
   python -m venv venv
   source venv/bin/activate   # on Windows: venv\Scripts\activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the service**

   ```bash
   python app.py
   ```

   The API will be available at `http://127.0.0.1:5000`.

## Running the tests

```bash
pytest
```

All tests should pass:

```
=== 3 passed in X.XXs ===
```

## Docker

### Build the image

```bash
docker build -t speaker-api .
```

### Run the container

```bash
docker run -p 5000:5000 speaker-api
```

The service will be reachable at `http://localhost:5000`.

## Project structure

```
speaker-api/
├── app.py               # Flask application
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker image definition
├── .dockerignore        # Files excluded from the Docker context
├── tests/
│   └── test_app.py      # pytest test suite
└── README.md            # This file
```

## Extending the service

- Add more speakers to the `SPEAKERS` list in `app.py`.
- Implement additional endpoints (e.g., talks) following the same pattern.
- Replace the hard‑coded data with a database when needed.

## License

This example is provided for educational purposes and is free to use and modify.