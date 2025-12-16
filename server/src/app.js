const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const navigationRouter = require('./routes/navigation');
const { HttpError } = require('./utils/errors');

const app = express();
app.set('etag', false);
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/navigation', navigationRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }
  if (err.name === 'ZodError') {
    return res.status(422).json({ message: 'Validation error', details: err.issues });
  }
  return res.status(500).json({ message: 'Unexpected error' });
});

module.exports = app;

