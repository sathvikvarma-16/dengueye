const metrics = {
  totalRequests: 0,
  totalErrors: 0,
  healthChecks: 0,
  cacheHits: 0,
  cacheMisses: 0,
};

export const recordMetric = (name, value = 1) => {
  if (typeof metrics[name] === 'number') {
    metrics[name] += value;
  }
};

export const getMetricsSnapshot = () => ({
  ...metrics,
  uptimeSeconds: Math.floor(process.uptime()),
});
