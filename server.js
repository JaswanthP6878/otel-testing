// server.js
require('./otel');

const express = require('express');
const app = express();
const { logs } = require('@opentelemetry/api-logs');

const logger = logs.getLogger('express-app');

app.get('/', (req, res) => {
  logger.emit({
    body: 'Handling GET /',
    severityText: 'INFO',
    attributes: { route: '/', method: 'GET' },
  });

  res.send('Hello from OpenTelemetry + Express!');
});

app.listen(3000, () => {
  logger.emit({
    body: 'Server listening on port 3000',
    severityText: 'INFO',
  });

  console.log('Server is running on port 3000');
});
