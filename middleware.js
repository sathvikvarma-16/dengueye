import { config } from './config.js';
import { logger } from './logger.js';
import { recordMetric } from './metrics.js';

const timeoutWrap = (req, res, next) => {
  const timeout = Number(config.requestTimeoutMs || 5000);
  req.setTimeout(timeout, () => {
    logger.warn('Request timed out', { path: req.path, requestId: req.requestId });
    recordMetric('totalErrors');
    res.status(504).json({ message: 'Request timed out' });
  });
  next();
};

export const requestTimeoutMiddleware = timeoutWrap;

export const metricsMiddleware = (req, res, next) => {
  recordMetric('totalRequests');
  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    if (res.statusCode >= 400) {
      recordMetric('totalErrors');
    }
    return originalJson(payload);
  };
  next();
};

export const requestLoggerMiddleware = (req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    requestId: req.requestId,
  });
  next();
};
