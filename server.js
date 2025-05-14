import express from "express";
import client from "prom-client";

const app = express();
client.collectDefaultMetrics();

const counter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "path", "status"],
});

app.use((req, res, next) => {
  res.on("finish", () => {
    counter.inc({ method: req.method, path: req.path, status: res.statusCode });
  });
  next();
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

app.listen(3000, () => console.log("Server listening on port 3000"));
