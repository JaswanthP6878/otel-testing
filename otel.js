// otel.js

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { logs } = require('@opentelemetry/api-logs');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { LoggerProvider } = require('@opentelemetry/sdk-logs');
const { SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/traces',
});

const logExporter = new OTLPLogExporter({
  url: 'http://grafana-k8s-monitoring-alloy-receiver.default.svc.cluster.local:4318/v1/logs',
});

const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));

logs.setGlobalLoggerProvider(loggerProvider);
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
