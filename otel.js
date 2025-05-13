// otel.js
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { LoggerProvider } = require('@opentelemetry/sdk-logs');
const { SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');

// Enable diagnostic logging (optional)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Trace exporter
const traceExporter = new OTLPTraceExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/traces',
});

// Log exporter
const logExporter = new OTLPLogExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/logs',
});

// Logging setup
const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));
loggerProvider.register();

// SDK init
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  loggerProvider,
});

sdk.start()
  .then(() => {
    console.log('OpenTelemetry tracing and logging initialized');
  })
  .catch((error) => {
    console.log('Error initializing OpenTelemetry', error);
  });

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry shutdown complete'))
    .catch((error) => console.log('OpenTelemetry shutdown error', error))
    .finally(() => process.exit(0));
});

module.exports = { loggerProvider };
