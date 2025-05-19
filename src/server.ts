// src/server.ts
import express from "express";
import client from "prom-client";
import { endexLogger } from "./endexLogger";

const app = express();

// Prometheus metrics setup
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

// Trigger a multi-level async error
app.get("/err", async (_req, res) => {
  try {
    await firstFunction();
  } catch (err: any) {
    const wrappedError = new Error("Final handler caught the error");
    wrappedError.stack += `\nCaused by: ${err.stack}`;
    endexLogger.error(wrappedError);
    res.status(500).send("Error triggered and logged");
  }
});

async function firstFunction() {
  return await secondFunction();
}

async function secondFunction() {
  return await thirdFunction();
}

async function thirdFunction() {
  throw new Error("💥 Simulated low-level async failure!");
}

app.get("/metrics", async (_req, res) => {
  endexLogger.debug("Serving Prometheus metrics");
  res.set("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

app.listen(3000, "0.0.0.0", () => {
  endexLogger.info("🚀 Server listening on port 3000");
});
