FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install tracing dependencies
RUN pip install --no-cache-dir opentelemetry-distro opentelemetry-exporter-otlp && opentelemetry-bootstrap -a install

# Copy application code
COPY . .

EXPOSE 5000

# Run the Flask app
CMD ["opentelemetry-instrument", "python", "app.py"]
