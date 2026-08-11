import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import { config } from './config.js';
import { logger } from './logger.js';
import { redisClient, cacheGet, cacheSet, cacheDel, connectRedis } from './redis.js';
import { authMiddleware, signToken } from './auth.js';
import { enqueueJob, getJobStatus } from './queue.js';
import { query } from './db.js';
import { requestTimeoutMiddleware, metricsMiddleware, requestLoggerMiddleware } from './middleware.js';
import { getMetricsSnapshot, recordMetric } from './metrics.js';

const DEMO_USERS = {
  'worker1@gvmc.gov.in': { email: 'worker1@gvmc.gov.in', phone: '+91 98480 12301', password: 'Worker1@GVMC', role: 'FIELD_HEALTH_WORKER', name: 'A. Hymavathi' },
  'worker2@gvmc.gov.in': { email: 'worker2@gvmc.gov.in', phone: '+91 98480 12302', password: 'Worker2@GVMC', role: 'FIELD_HEALTH_WORKER', name: 'R. Sireesha' },
  'worker3@gvmc.gov.in': { email: 'worker3@gvmc.gov.in', phone: '+91 98480 12303', password: 'Worker3@GVMC', role: 'FIELD_HEALTH_WORKER', name: 'K. Mohan Rao' },
  'worker4@gvmc.gov.in': { email: 'worker4@gvmc.gov.in', phone: '+91 98480 12304', password: 'Worker4@GVMC', role: 'FIELD_HEALTH_WORKER', name: 'P. Venkata Lakshmi' },
  'worker5@gvmc.gov.in': { email: 'worker5@gvmc.gov.in', phone: '+91 98480 12305', password: 'Worker5@GVMC', role: 'FIELD_HEALTH_WORKER', name: 'N. Harika' },
  'worker6@gvmc.gov.in': { email: 'worker6@gvmc.gov.in', phone: '+91 98480 12306', password: 'Worker6@GVMC', role: 'FIELD_HEALTH_WORKER', name: 'G. Pradeep' },
  'supervisor1@gvmc.gov.in': { email: 'supervisor1@gvmc.gov.in', phone: '+91 94401 88999', password: 'Supervisor1@GVMC', role: 'PUBLIC_HEALTH_SUPERVISOR', name: 'Dr. M. Appa Rao' },
  'supervisor2@gvmc.gov.in': { email: 'supervisor2@gvmc.gov.in', phone: '+91 94401 88201', password: 'Supervisor2@GVMC', role: 'PUBLIC_HEALTH_SUPERVISOR', name: 'K. Srinivas Rao' },
  'commissioner@gvmc.gov.in': { email: 'commissioner@gvmc.gov.in', phone: '+91 90000 00001', password: 'Commissioner@GVMC', role: 'COMMISSIONER', name: 'GVMC Commissioner' },
};

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: `${config.uploadMaxBytes}` }));
app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(requestTimeoutMiddleware);
app.use(metricsMiddleware);
app.use(requestLoggerMiddleware);

app.use((req, res, next) => {
  req.requestId = randomUUID();
  next();
});

const getDependencyStatus = async () => {
  const services = {
    database: 'unavailable',
    redis: 'unavailable',
  };

  try {
    await query('SELECT 1');
    services.database = 'ok';
  } catch (error) {
    logger.warn('Database dependency unavailable for demo health report', { error: error.message });
  }

  try {
    await redisClient.ping();
    services.redis = 'ok';
  } catch (error) {
    logger.warn('Redis dependency unavailable for demo health report', { error: error.message });
  }

  return services;
};

app.get('/health', async (req, res) => {
  try {
    recordMetric('healthChecks');
    const services = await getDependencyStatus();
    const healthState = services.database === 'ok' && services.redis === 'ok' ? 'ok' : 'degraded';
    return res.status(healthState === 'ok' ? 200 : 200).json({
      status: healthState,
      timestamp: new Date().toISOString(),
      services,
      mode: 'demo-frontend-backend-ready',
    });
  } catch (error) {
    logger.error('health check failed', { error: error.message });
    return res.status(503).json({ status: 'degraded', services: { database: 'unavailable', redis: 'unavailable' } });
  }
});

app.get('/ready', async (req, res) => {
  try {
    const services = await getDependencyStatus();
    const ready = services.database === 'ok' && services.redis === 'ok';
    return res.status(ready ? 200 : 200).json({ ready, services });
  } catch (error) {
    return res.status(503).json({ ready: false, error: error.message, services: { database: 'unavailable', redis: 'unavailable' } });
  }
});

app.get('/metrics', async (req, res) => {
  return res.json(getMetricsSnapshot());
});

app.post('/api/auth/login', async (req, res) => {
  const { email, identifier, password } = req.body || {};
  const incomingIdentifier = (email || identifier || '').toString().trim().toLowerCase();

  if (!incomingIdentifier || !password) {
    return res.status(400).json({ message: 'email/phone and password are required' });
  }

  if (typeof password !== 'string') {
    return res.status(400).json({ message: 'invalid login payload' });
  }

  const normalizedIdentifier = incomingIdentifier.replace(/\s+/g, '');
  const account = DEMO_USERS[incomingIdentifier] || Object.values(DEMO_USERS).find((candidate) => {
    const normalizedPhone = candidate.phone.replace(/\s+/g, '');
    return candidate.email === incomingIdentifier || normalizedPhone === normalizedIdentifier;
  });

  if (!account || account.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = signToken({
    email: account.email,
    role: account.role,
    name: account.name,
    sub: account.email,
  });

  return res.json({
    token,
    user: {
      email: account.email,
      role: account.role,
      name: account.name,
    },
  });
});

app.get('/api/cases', authMiddleware, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 25), 100);
  const offset = (page - 1) * limit;

  if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
    return res.status(400).json({ message: 'page and limit must be positive integers' });
  }

  const cacheKey = `cases:page:${page}:limit:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    recordMetric('cacheHits');
    return res.json(cached);
  }

  recordMetric('cacheMisses');

  try {
    const result = await query('SELECT * FROM cases ORDER BY reported_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    const countResult = await query('SELECT COUNT(*)::int AS total FROM cases');
    const payload = {
      items: result.rows,
      page,
      limit,
      total: countResult.rows[0]?.total ?? 0,
    };

    await cacheSet(cacheKey, payload);
    return res.json(payload);
  } catch (dbError) {
    logger.warn('Database query failed for /api/cases', { error: dbError && dbError.message ? dbError.message : String(dbError) });
    return res.status(503).json({ message: 'Database unavailable', items: [], page, limit, total: 0 });
  }
});

app.post('/api/jobs', authMiddleware, async (req, res) => {
  const job = await enqueueJob('generate-survey-export', req.body || {});
  return res.status(202).json(job);
});

app.get('/api/jobs/:jobId', authMiddleware, async (req, res) => {
  const job = await getJobStatus(req.params.jobId);
  return job ? res.json(job) : res.status(404).json({ message: 'Job not found' });
});

app.delete('/api/cache/:cacheKey', authMiddleware, async (req, res) => {
  await cacheDel(req.params.cacheKey);
  return res.json({ deleted: true, key: req.params.cacheKey });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled api error', { requestId: req.requestId, error: err.message });
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Internal server error' });
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    logger.info('DENGUEYE backend started', { port });
  });

  server.on('error', (error) => {
    if (error && error.code === 'EADDRINUSE') {
      logger.warn('Port already in use, retrying with next port', { port, nextPort: port + 1 });
      startServer(port + 1);
      return;
    }

    logger.error('Server startup failed', { error: error.message });
    process.exit(1);
  });
};
// Export the express app for serverless hosting (Vercel) and provide
// a local bootstrap function for running the backend in a persistent process.
export { app };

export const bootstrapLocal = async () => {
  await connectRedis();
  startServer(config.port);
};
