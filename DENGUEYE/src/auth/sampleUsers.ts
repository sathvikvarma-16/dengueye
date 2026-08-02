import { UserRole } from '../types';

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  wardId?: string;
  wardName?: string;
  isActive: boolean;
}

export const SAMPLE_USERS: AuthenticatedUser[] = [
  {
    id: 'WHW-001',
    fullName: 'A. Hymavathi',
    email: 'worker1@gvmc.gov.in',
    phone: '+91 98480 12301',
    password: 'Worker1@GVMC',
    role: 'FIELD_HEALTH_WORKER',
    wardId: 'ward-15',
    wardName: 'MVP Colony',
    isActive: true,
  },
  {
    id: 'WHW-002',
    fullName: 'R. Sireesha',
    email: 'worker2@gvmc.gov.in',
    phone: '+91 98480 12302',
    password: 'Worker2@GVMC',
    role: 'FIELD_HEALTH_WORKER',
    wardId: 'ward-6',
    wardName: 'Madhurawada',
    isActive: true,
  },
  {
    id: 'WHW-003',
    fullName: 'K. Mohan Rao',
    email: 'worker3@gvmc.gov.in',
    phone: '+91 98480 12303',
    password: 'Worker3@GVMC',
    role: 'FIELD_HEALTH_WORKER',
    wardId: 'ward-65',
    wardName: 'Gajuwaka',
    isActive: true,
  },
  {
    id: 'WHW-004',
    fullName: 'P. Venkata Lakshmi',
    email: 'worker4@gvmc.gov.in',
    phone: '+91 98480 12304',
    password: 'Worker4@GVMC',
    role: 'FIELD_HEALTH_WORKER',
    wardId: 'ward-22',
    wardName: 'Maharani Peta',
    isActive: true,
  },
  {
    id: 'WHW-005',
    fullName: 'N. Harika',
    email: 'worker5@gvmc.gov.in',
    phone: '+91 98480 12305',
    password: 'Worker5@GVMC',
    role: 'FIELD_HEALTH_WORKER',
    wardId: 'ward-18',
    wardName: 'Siripuram',
    isActive: true,
  },
  {
    id: 'WHW-006',
    fullName: 'G. Pradeep',
    email: 'worker6@gvmc.gov.in',
    phone: '+91 98480 12306',
    password: 'Worker6@GVMC',
    role: 'FIELD_HEALTH_WORKER',
    wardId: 'ward-25',
    wardName: 'Jagadamba Junction',
    isActive: true,
  },
  {
    id: 'PHS-001',
    fullName: 'Dr. M. Appa Rao',
    email: 'supervisor1@gvmc.gov.in',
    phone: '+91 94401 88999',
    password: 'Supervisor1@GVMC',
    role: 'PUBLIC_HEALTH_SUPERVISOR',
    wardId: 'ward-15',
    wardName: 'MVP Colony',
    isActive: true,
  },
  {
    id: 'PHS-002',
    fullName: 'K. Srinivas Rao',
    email: 'supervisor2@gvmc.gov.in',
    phone: '+91 94401 88201',
    password: 'Supervisor2@GVMC',
    role: 'PUBLIC_HEALTH_SUPERVISOR',
    wardId: 'ward-65',
    wardName: 'Gajuwaka',
    isActive: true,
  },
  {
    id: 'GVC-001',
    fullName: 'GVMC Commissioner',
    email: 'commissioner@gvmc.gov.in',
    phone: '+91 90000 00001',
    password: 'Commissioner@GVMC',
    role: 'COMMISSIONER',
    isActive: true,
  },
];
