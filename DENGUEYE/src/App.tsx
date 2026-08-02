import React, { useState, useMemo, useEffect } from 'react';
import './index.css';
import { UserRole, DiseaseCase, VectorDispatchTask, SMSAlertLog, GISCluster, PhotoEvidenceAsset } from './types';
import { INITIAL_WARDS, INITIAL_CASES, INITIAL_DISPATCHES, INITIAL_SMS_LOGS } from './data/vizagWardsData';
import { detect48HourClusters } from './utils/clusterEngine';
import { Sidebar } from './components/Sidebar';
import { GisMap } from './components/GisMap';
import { CommandCenter } from './components/CommandCenter';
import { VectorControlDispatch } from './components/VectorControlDispatch';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { FieldReportingForm } from './components/FieldReportingForm';
import { SmsGatewaySimulator } from './components/SmsGatewaySimulator';
import { AuthLogin } from './components/AuthLogin';
import { useAuth } from './auth/AuthContext';
import { resetDemoUsers } from './auth/session';
import { Zap, X } from 'lucide-react';

const CASES_STORAGE_KEY = 'dengueye-demo-cases';
const DISPATCHES_STORAGE_KEY = 'dengueye-demo-dispatches';
const SMS_STORAGE_KEY = 'dengueye-demo-sms';
const WARDS_STORAGE_KEY = 'dengueye-demo-wards';
const PHOTO_ASSETS_KEY = 'dengueye-demo-photo-assets';

const readStorageData = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};

const writeStorageData = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export function App() {
  const { user, role, login, logout } = useAuth();
  const currentRole = role ?? 'FIELD_HEALTH_WORKER';
  const [activeTab, setActiveTab] = useState<'map' | 'command' | 'dispatch' | 'analytics'>('map');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [wards, setWards] = useState(() => readStorageData(WARDS_STORAGE_KEY, INITIAL_WARDS));
  const [cases, setCases] = useState<DiseaseCase[]>(() => readStorageData(CASES_STORAGE_KEY, INITIAL_CASES));
  const [photoAssets, setPhotoAssets] = useState<PhotoEvidenceAsset[]>(() => readStorageData(PHOTO_ASSETS_KEY, []));
  const [dispatches, setDispatches] = useState<VectorDispatchTask[]>(() => readStorageData(DISPATCHES_STORAGE_KEY, INITIAL_DISPATCHES));
  const [smsLogs, setSmsLogs] = useState<SMSAlertLog[]>(() => readStorageData(SMS_STORAGE_KEY, INITIAL_SMS_LOGS));

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    resetDemoUsers();
    window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(INITIAL_CASES));
    window.localStorage.setItem(DISPATCHES_STORAGE_KEY, JSON.stringify(INITIAL_DISPATCHES));
    window.localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(INITIAL_SMS_LOGS));
    window.localStorage.setItem(WARDS_STORAGE_KEY, JSON.stringify(INITIAL_WARDS));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    writeStorageData(CASES_STORAGE_KEY, cases);
  }, [cases]);

  useEffect(() => {
    writeStorageData(PHOTO_ASSETS_KEY, photoAssets);
  }, [photoAssets]);

  useEffect(() => {
    writeStorageData(DISPATCHES_STORAGE_KEY, dispatches);
  }, [dispatches]);

  useEffect(() => {
    writeStorageData(SMS_STORAGE_KEY, smsLogs);
  }, [smsLogs]);

  useEffect(() => {
    writeStorageData(WARDS_STORAGE_KEY, wards);
  }, [wards]);

  useEffect(() => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const allowedDefaultMap = currentRole === 'COMMISSIONER' ? 'map' : currentRole === 'PUBLIC_HEALTH_SUPERVISOR' ? 'dispatch' : 'map';
    setActiveTab(allowedDefaultMap);
  }, [user, currentRole]);

  const { clusters } = useMemo(() => {
    return detect48HourClusters(cases, wards, 48, 500);
  }, [cases, wards]);

  const criticalClusters = clusters.filter(c => c.riskLevel === 'CRITICAL');

  const handleAddCase = (newCase: DiseaseCase) => {
    const photoAssetId = `PHOTO-${newCase.id}`;
    const storedAt = new Date().toISOString();

    const persistedCase: DiseaseCase = {
      ...newCase,
      photoAssetId,
      photoStoredAt: storedAt,
    };

    if (newCase.photoProofBase64) {
      const photoDataUrl = newCase.photoProofBase64;
      const photoAsset: PhotoEvidenceAsset = {
        id: photoAssetId,
        caseId: persistedCase.id,
        patientName: persistedCase.patientName,
        wardName: persistedCase.wardName,
        reporterName: persistedCase.reporterName,
        capturedAt: storedAt,
        dataUrl: photoDataUrl,
      };

      setPhotoAssets(prev => [photoAsset, ...prev]);
    }

    const updatedCases = [persistedCase, ...cases];
    setCases(updatedCases);

    setWards(prev => prev.map(w => {
      if (w.id === newCase.wardId) {
        const count = w.activeCasesCount + 1;
        return {
          ...w,
          activeCasesCount: count,
          riskLevel: count >= 5 ? 'CRITICAL' : count >= 3 ? 'HIGH' : 'MODERATE'
        };
      }
      return w;
    }));

    setActiveToast(`New case reported by ${newCase.reporterName} in ${newCase.wardName}. 48h GIS clusters re-evaluated!`);
  };

  const handleDispatchCluster = (cluster: GISCluster) => {
    const ward = wards.find(w => w.id === cluster.wardId);
    
    const newTask: VectorDispatchTask = {
      id: `DISP-2026-${Math.floor(300 + Math.random() * 700)}`,
      clusterId: cluster.id,
      wardId: cluster.wardId,
      wardName: cluster.wardName,
      targetAddress: `${cluster.wardName} Cluster Centroid`,
      lat: cluster.centerLat,
      lng: cluster.centerLng,
      taskType: 'Thermal Fogging',
      priority: 'EMERGENCY 48H',
      status: 'DISPATCHED',
      assignedTeam: `GVMC Fogging Unit #${ward?.number || 1}`,
      dispatchedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      notes: `Automated 48H Emergency Dispatch for Cluster ${cluster.clusterCode}`
    };

    setDispatches([newTask, ...dispatches]);

    const newSms: SMSAlertLog = {
      id: `SMS-${Math.floor(9000 + Math.random() * 999)}`,
      timestamp: new Date().toISOString(),
      recipientRole: 'GVMC Fogging Team Leader',
      recipientName: 'M. Appa Rao',
      phoneNumber: '+91 94401 88999',
      messageText: `DISPATCH MISSION: Emergency 48H Thermal Fogging assigned for Cluster ${cluster.clusterCode} in ${cluster.wardName}.`,
      status: 'DELIVERED',
      clusterCode: cluster.clusterCode
    };

    setSmsLogs([newSms, ...smsLogs]);
    setActiveToast(`Emergency Vector Control Team Dispatched for ${cluster.clusterCode}!`);
    setActiveTab('dispatch');
  };

  const handleUpdateDispatchStatus = (taskId: string, newStatus: VectorDispatchTask['status']) => {
    setDispatches(prev => prev.map(d => d.id === taskId ? { ...d, status: newStatus } : d));
    setActiveToast(`Vector Mission ${taskId} updated to ${newStatus}`);
  };

  const handleCreateDispatch = (newTask: VectorDispatchTask) => {
    setDispatches([newTask, ...dispatches]);
    setActiveToast(`Vector Dispatch Mission ${newTask.id} created successfully.`);
  };

  const handleSendTestSms = () => {
    const testSms: SMSAlertLog = {
      id: `SMS-${Math.floor(5000 + Math.random() * 4000)}`,
      timestamp: new Date().toISOString(),
      recipientRole: 'GVMC Public Health Officer',
      recipientName: 'Dr. K. Srinivas Rao',
      phoneNumber: '+91 94401 88201',
      messageText: '[TEST DENGUEYE ALERT] System operational across 10 Visakhapatnam Wards.',
      status: 'DELIVERED',
      clusterCode: 'TEST-SYS-01'
    };
    setSmsLogs([testSms, ...smsLogs]);
    setActiveToast('Test SMS broadcast sent.');
  };

  return (
    <div className="app-container" data-theme={theme}>
      
      {/* Expandable Sidebar Component */}
      <Sidebar
        currentRole={currentRole}
        userName={user?.fullName ?? 'Guest User'}
        userEmail={user?.email ?? 'Not signed in'}
        userPhone={user?.phone ?? '—'}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSmsModal={() => setIsSmsModalOpen(true)}
        onOpenLoginModal={() => setIsAuthModalOpen(true)}
        criticalClusterCount={criticalClusters.length}
        totalActiveCases={cases.length}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Wrapper */}
      <div className={`main-content-wrapper ${isSidebarExpanded ? 'main-content-expanded' : 'main-content-collapsed'}`}>
        
        {/* Notification Toast */}
        {activeToast && (
          <div style={{ padding: '1rem 2.5rem 0' }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--accent-blue)',
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              color: 'var(--text-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Zap style={{ width: 18, height: 18, color: 'var(--accent-blue)' }} />
                <span>{activeToast}</span>
              </div>
              <button onClick={() => setActiveToast(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="app-main">
          {!user && (
            <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              Please sign in to access the DenguEye operations dashboard.
            </div>
          )}

          {user && activeTab === 'map' && currentRole !== 'FIELD_HEALTH_WORKER' && (
            <GisMap
              wards={wards}
              cases={cases}
              clusters={clusters}
              dispatches={dispatches}
              onDispatchCluster={handleDispatchCluster}
            />
          )}

          {user && activeTab === 'command' && currentRole === 'COMMISSIONER' && (
            <CommandCenter
              wards={wards}
              clusters={clusters}
              cases={cases}
              dispatches={dispatches}
              onDispatchCluster={handleDispatchCluster}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}

          {user && activeTab === 'dispatch' && currentRole !== 'FIELD_HEALTH_WORKER' && (
            <VectorControlDispatch
              dispatches={dispatches}
              wards={wards}
              clusters={clusters}
              onUpdateStatus={handleUpdateDispatchStatus}
              onCreateDispatch={handleCreateDispatch}
            />
          )}

          {user && activeTab === 'analytics' && (
            <AnalyticsPanel
              cases={cases}
              wards={wards}
              clusters={clusters}
              photoAssets={photoAssets}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          GVMC Visakhapatnam Public Health Vector Control Division • Powered by DENGUEYE 48H GIS Early Warning Engine
        </footer>

      </div>

      {/* Modals */}
      <AuthLogin
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={(authenticatedUser) => {
          login(authenticatedUser);
          setIsAuthModalOpen(false);
        }}
      />

      <FieldReportingForm
        wards={wards}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitCase={handleAddCase}
      />

      <SmsGatewaySimulator
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        logs={smsLogs}
        onSendTestSms={handleSendTestSms}
      />


    </div>
  );
}
