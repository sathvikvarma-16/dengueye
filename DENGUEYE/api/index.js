import { app } from '../backend/server.js';

// Vercel Node runtime will call the default export as (req, res).
export default async function handler(req, res) {
  return app(req, res);
}
