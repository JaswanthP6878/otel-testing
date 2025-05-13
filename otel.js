// otel.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { LoggerProvider } = require('@opentelemetry/sdk-logs');

const traceExporter = new OTLPTraceExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/traces',
});

const metricExporter = new OTLPMetricExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/metrics',
});

const logExporter = new OTLPLogExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/logs',
});

const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new ConsoleLogRecordProcessor(logExporter));
loggerProvider.forceFlush();

const sdk = new NodeSDK({
  traceExporter,
  metricExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  loggerProvider,
});

sdk.start();
