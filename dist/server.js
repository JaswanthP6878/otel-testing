"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const endexLogger_1 = require("./endexLogger"); // Make sure this uses winston.format.errors({ stack: true })
const app = (0, express_1.default)();
// Setup Prometheus metrics
prom_client_1.default.collectDefaultMetrics();
const httpRequestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total HTTP requests",
    labelNames: ["method", "path", "status"],
});
// Middleware to track metrics
app.use((req, res, next) => {
    res.on("finish", () => {
        httpRequestCounter.inc({
            method: req.method,
            path: req.path,
            status: res.statusCode,
        });
    });
    next();
});
// Normal route
app.get("/", (_req, res) => {
    endexLogger_1.endexLogger.info("Received request on /");
    res.send("Hello, world!");
});
// Route that triggers a nested async error
app.get("/err", async (_req, res) => {
    try {
        await simulateError();
        res.send("This will never run");
    }
    catch (err) {
        endexLogger_1.endexLogger.error("Unhandled error caught in /err", err);
        res.status(500).send("Internal Server Error");
    }
});
// Metrics route
app.get("/metrics", async (_req, res) => {
    endexLogger_1.endexLogger.debug("Serving Prometheus metrics");
    res.set("Content-Type", prom_client_1.default.register.contentType);
    res.send(await prom_client_1.default.register.metrics());
});
// Fake async error generator to produce a realistic stack trace
async function simulateError() {
    return firstLayer();
}
async function firstLayer() {
    return secondLayer();
}
async function secondLayer() {
    throw new Error("💥 Simulated multi-layered async failure!");
}
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    endexLogger_1.endexLogger.info(`🚀 Server listening on http://localhost:${PORT}`);
});
