import { createClient } from 'redis';
import { config } from './config.js';

export const redisClient = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
});

redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch {
    // fail-open as the app may be running without a redis instance in demo mode
  }
};

export const cacheGet = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds = config.redis.ttlSeconds) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch {
    // fail-open for cache
  }
};

export const cacheDel = async (key) => {
  try {
    await redisClient.del(key);
  } catch {
    // fail-open for cache
  }
};
