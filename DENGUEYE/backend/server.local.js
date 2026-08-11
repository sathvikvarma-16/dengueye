#!/usr/bin/env node
import { bootstrapLocal } from './server.js';

const run = async () => {
  try {
    await bootstrapLocal();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start local backend', err);
    process.exit(1);
  }
};

run();
