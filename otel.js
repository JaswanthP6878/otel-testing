// otel.js

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { logs } = require('@opentelemetry/api-logs');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { LoggerProvider } = require('@opentelemetry/sdk-logs');
const { SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');

// Enable optional diagnostics
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Setup trace exporter
const traceExporter = new OTLPTraceExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/traces',
});

// Setup log exporter
const logExporter = new OTLPLogExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/logs',
});

// Setup logger provider
const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));

// ✅ Register logger provider globally
logs.setGlobalLoggerProvider(loggerProvider);

// Create and start SDK
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK shutdown complete'))
    .catch((err) => console.error('Error shutting down OpenTelemetry SDK', err))
    .finally(() => process.exit(0));
});
