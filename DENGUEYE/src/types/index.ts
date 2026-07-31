export type DiseaseType = 'Dengue' | 'Malaria' | 'Chikungunya';

export type DiagnosticStatus = 'NS1 Positive' | 'IgM Positive' | 'Smear Positive' | 'Clinical Suspect' | 'Confirmed Rapid Test';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface WardInfo {
  id: string;
  name: string;
  number: number;
  zone: string;
  population: number;
  center: [number, number]; // [lat, lng]
  boundaries?: [number, number][]; // Polygon coords
  officerName: string;
  officerContact: string;
  activeCasesCount: number;
  riskLevel: RiskLevel;
  lastFoggingDate: string;
}

export interface DiseaseCase {
  id: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  disease: DiseaseType;
  diagnosticStatus: DiagnosticStatus;
  wardId: string;
  wardName: string;
  address: string;
  lat: number;
  lng: number;
  reportedAt: string; // ISO string
  reporterType: 'Ward Health Worker' | 'PHC Clinic' | 'Lab Partner' | 'Public Complaint';
  reporterName: string;
  reporterContact: string;
  symptomOnsetDaysAgo: number;
  hasMosquitoBreedingSite: boolean;
  breedingSiteNotes?: string;
  status: 'Reported' | 'Verified' | 'Under Investigation' | 'Resolved';
  photoProofBase64?: string;
}

export interface GISCluster {
  id: string;
  clusterCode: string;
  wardId: string;
  wardName: string;
  centerLat: number;
  centerLng: number;
  caseIds: string[];
  caseCount: number;
  diseaseType: DiseaseType;
  radiusMeters: number;
  detectedAt: string;
  firstReportAt: string;
  latestReportAt: string;
  timeWindowHours: number; // e.g. 48h
  riskLevel: RiskLevel;
  dispatchStatus: 'Pending Dispatch' | 'Team Dispatched' | 'Fogging Completed' | 'Resolved';
  assignedTeam?: string;
}

export interface VectorDispatchTask {
  id: string;
  clusterId: string;
  wardId: string;
  wardName: string;
  targetAddress: string;
  lat: number;
  lng: number;
  taskType: 'Thermal Fogging' | 'Abate Larvicide Treatment' | 'Container Source Reduction' | 'Anti-Larval Spray';
  priority: 'EMERGENCY 48H' | 'HIGH' | 'ROUTINE';
  status: 'PENDING' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTeam: string;
  dispatchedAt: string;
  estimatedCompletion: string;
  completedAt?: string;
  notes?: string;
}

export interface SMSAlertLog {
  id: string;
  timestamp: string;
  recipientRole: string;
  recipientName: string;
  phoneNumber: string;
  messageText: string;
  status: 'DELIVERED' | 'QUEUED' | 'FAILED';
  clusterCode: string;
}

export type UserRole = 'COMMISSIONER' | 'PUBLIC_HEALTH_SUPERVISOR' | 'FIELD_HEALTH_WORKER';
