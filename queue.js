import { v4 as uuidv4 } from 'uuid';

const jobs = new Map();

export const enqueueJob = async (type, payload = {}) => {
  const jobId = uuidv4();
  jobs.set(jobId, { id: jobId, type, payload, status: 'queued' });
  return { jobId, status: 'queued' };
};

export const getJobStatus = async (jobId) => {
  return jobs.get(jobId) ?? null;
};
