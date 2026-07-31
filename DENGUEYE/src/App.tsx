import React, { useState, useMemo, useEffect } from 'react';
import './index.css';
import { UserRole, DiseaseCase, VectorDispatchTask, SMSAlertLog, GISCluster } from './types';
import { INITIAL_WARDS, INITIAL_CASES, INITIAL_DISPATCHES, INITIAL_SMS_LOGS } from './data/vizagWardsData';
import { detect48HourClusters } from './utils/clusterEngine';
import { Sidebar } from './components/Sidebar';
import { GisMap } from './components/GisMap';
import { CommandCenter } from './components/CommandCenter';
import { VectorControlDispatch } from './components/VectorControlDispatch';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { FieldReportingForm } from './components/FieldReportingForm';
import { SmsGatewaySimulator } from './components/SmsGatewaySimulator';
import { Zap, X } from 'lucide-react';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('COMMISSIONER');
  const [activeTab, setActiveTab] = useState<'map' | 'command' | 'dispatch' | 'analytics'>('map');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [wards, setWards] = useState(INITIAL_WARDS);
  const [cases, setCases] = useState<DiseaseCase[]>(INITIAL_CASES);
  const [dispatches, setDispatches] = useState<VectorDispatchTask[]>(INITIAL_DISPATCHES);
  const [smsLogs, setSmsLogs] = useState<SMSAlertLog[]>(INITIAL_SMS_LOGS);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Sync data-theme attribute on <html> / <body> tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const { clusters } = useMemo(() => {
    return detect48HourClusters(cases, wards, 48, 500);
  }, [cases, wards]);

  const criticalClusters = clusters.filter(c => c.riskLevel === 'CRITICAL');

  const handleAddCase = (newCase: DiseaseCase) => {
    const updatedCases = [newCase, ...cases];
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
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSmsModal={() => setIsSmsModalOpen(true)}
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
          {activeTab === 'map' && (
            <GisMap
              wards={wards}
              cases={cases}
              clusters={clusters}
              dispatches={dispatches}
              onDispatchCluster={handleDispatchCluster}
            />
          )}

          {activeTab === 'command' && (
            <CommandCenter
              wards={wards}
              clusters={clusters}
              cases={cases}
              dispatches={dispatches}
              onDispatchCluster={handleDispatchCluster}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}

          {activeTab === 'dispatch' && (
            <VectorControlDispatch
              dispatches={dispatches}
              wards={wards}
              clusters={clusters}
              onUpdateStatus={handleUpdateDispatchStatus}
              onCreateDispatch={handleCreateDispatch}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPanel
              cases={cases}
              wards={wards}
              clusters={clusters}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          GVMC Visakhapatnam Public Health Vector Control Division • Powered by DENGUEYE 48H GIS Early Warning Engine
        </footer>

      </div>

      {/* Modals */}
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
