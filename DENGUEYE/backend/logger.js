const levelPriority = { error: 0, warn: 1, info: 2, debug: 3 };

const currentLevel = levelPriority[process.env.LOG_LEVEL || 'info'] ?? levelPriority.info;

const log = (level, message, details = {}) => {
  if ((levelPriority[level] ?? levelPriority.info) > currentLevel) return;
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...details,
  };
  console.log(JSON.stringify(payload));
};

export const logger = {
  error: (message, details) => log('error', message, details),
  warn: (message, details) => log('warn', message, details),
  info: (message, details) => log('info', message, details),
  debug: (message, details) => log('debug', message, details),
};
