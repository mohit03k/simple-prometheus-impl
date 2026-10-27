# Prometheus + Grafana Demo

**Prometheus** collects and stores application metrics, such as request counts and response times.

**Grafana** turns those metrics into dashboards and charts that teams can view and share. It provides the visualization tools, so you don't need to build a dashboard UI yourself—you still configure the queries and panels.

This is a simple learning project using an Express app, Prometheus, and Grafana with Docker Compose.

## How it works

- Express exposes request counts and response durations at `/metrics`.
- Prometheus scrapes that endpoint every 15 seconds.
- Grafana connects to Prometheus to visualize the collected metrics.

## Run locally

With Docker and Docker Compose installed and running:

```bash
docker compose up --build -d
```

Generate some requests:

```bash
for i in {1..50}; do curl -s http://localhost:3000/user > /dev/null; done
```

- App: http://localhost:3000/user
- Raw metrics: http://localhost:3000/metrics
- Prometheus: http://localhost:9090 — check `/targets` for an **UP** target after about 15 seconds.
- Grafana: http://localhost:3001 — initial login: `admin` / `admin`.

In Grafana, add a **Prometheus** data source with the URL `http://prometheus:9090`, then select **Save & test**. Use Explore or create a dashboard panel with this query:

```promql
request_count{route="/user"}
```

Dashboards are configured manually; none are included yet. The Dockerfile runs the existing `dist/` files, so TypeScript changes need to be compiled before rebuilding.

To stop:

```bash
docker compose down
```
