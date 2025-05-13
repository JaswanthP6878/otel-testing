require('./otel');

const express = require('express');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { logs } = require('@opentelemetry/api-logs');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
const app = express();
const port = 3000;

const logger = logs.getLogger('my-express-app');

app.get('/', (req, res) => {
  logger.emit({
    severityText: 'INFO',
    body: 'Handling root route',
    attributes: { route: '/' },
  });
  res.send('Hello from instrumented Express app!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
