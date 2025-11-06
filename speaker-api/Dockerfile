# syntax=docker/dockerfile:1
FROM python:3.12-slim

WORKDIR /app

# Install tracing dependencies
RUN pip install --no-cache-dir opentelemetry-distro opentelemetry-exporter-otlp

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && opentelemetry-bootstrap -a install

# Copy application code
COPY . .

EXPOSE 5000

# Run the Flask app
CMD ["opentelemetry-instrument", "python", "app.py"]
