import { UserRole } from '../types';

export type AppTab = 'map' | 'command' | 'dispatch' | 'analytics';

export const ROLE_ACCESS: Record<UserRole, { tabs: AppTab[]; actions: string[] }> = {
  FIELD_HEALTH_WORKER: {
    tabs: [],
    actions: ['REPORT_CASE'],
  },
  PUBLIC_HEALTH_SUPERVISOR: {
    tabs: ['map', 'dispatch', 'analytics'],
    actions: ['REPORT_CASE', 'VERIFY_CASES', 'DISPATCH_VECTOR_TEAMS', 'VIEW_ANALYTICS'],
  },
  COMMISSIONER: {
    tabs: ['map', 'command', 'dispatch', 'analytics'],
    actions: ['REPORT_CASE', 'VERIFY_CASES', 'DISPATCH_VECTOR_TEAMS', 'VIEW_ANALYTICS', 'VIEW_SMS_LOGS'],
  },
};

export const canAccessTab = (role: UserRole, tab: AppTab) => {
  return ROLE_ACCESS[role].tabs.includes(tab);
};

export const canPerformAction = (role: UserRole, action: string) => {
  return ROLE_ACCESS[role].actions.includes(action);
};

export const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case 'FIELD_HEALTH_WORKER':
      return 'Ward Health Worker';
    case 'PUBLIC_HEALTH_SUPERVISOR':
      return 'Public Health Supervisor';
    case 'COMMISSIONER':
      return 'GVMC Commissioner';
    default:
      return 'Unknown Role';
  }
};
