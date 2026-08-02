import { logger } from './logger.js';

const runWorker = async () => {
  logger.info('Background worker started');
  setInterval(() => {
    logger.info('queue worker heartbeat');
  }, 30000);
};

runWorker().catch((error) => {
  logger.error('Worker failed to start', { error: error.message });
  process.exit(1);
});
