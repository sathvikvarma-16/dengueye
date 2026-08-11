#!/usr/bin/env node
import { app } from './server.js';
import { randomUUID } from 'crypto';

// Minimal local starter that does NOT attempt to connect to Redis.
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  req.requestId = randomUUID();
  next();
});

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ message: 'DENGUEYE backend started (no-redis local)', port }));
});

server.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Server failed to start (no-redis local)', err && err.message ? err.message : err);
  process.exit(1);
});
