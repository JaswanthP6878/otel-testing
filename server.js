// server.js
require('./otel');

const express = require('express');
const app = express();

const { logs } = require('@opentelemetry/api-logs');
const logger = logs.getLogger('express-app');

app.get('/', (req, res) => {
  logger.emit({
    body: 'Received GET / request',
    severityText: 'INFO',
    attributes: { route: '/', method: 'GET' },
  });

  res.send('Hello from Express with tracing and logging!');
});

app.get('/error', (req, res) => {
  logger.emit({
    body: 'Something went wrong in /error route',
    severityText: 'ERROR',
    attributes: { route: '/error' },
  });

  res.status(500).send('Error occurred!');
});

app.listen(3000, () => {
  logger.emit({
    body: 'Express server started on port 3000',
    severityText: 'INFO',
  });
  console.log('Server running on port 3000');
});
