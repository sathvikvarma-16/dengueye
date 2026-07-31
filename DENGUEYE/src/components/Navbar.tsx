import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  UserCheck, 
  PlusCircle, 
  MessageSquare, 
  Activity, 
  Building2,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'map' | 'command' | 'dispatch' | 'analytics';
  setActiveTab: (tab: 'map' | 'command' | 'dispatch' | 'analytics') => void;
  onOpenReportModal: () => void;
  onOpenSmsModal: () => void;
  criticalClusterCount: number;
  totalActiveCases: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenSmsModal,
  criticalClusterCount,
  totalActiveCases
}) => {
  return (
    <header className="navbar-header">
      {/* Top Emergency Ticker */}
      <div className="emergency-ticker">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <span className="ticker-badge">
            <AlertTriangle style={{ width: '12px', height: '12px', marginRight: '4px' }} />
            GVMC REAL-TIME 48H SURVEILLANCE
          </span>
          <span style={{ color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Visakhapatnam Public Health Ops | <strong style={{ color: '#f87171' }}>{criticalClusterCount} Hotspot Clusters</strong> detected in last 48h | Total Active: <strong style={{ color: '#22d3ee' }}>{totalActiveCases} cases</strong> across 10 Pilot Wards
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '11px' }}>
          <span>City Ops Center: <strong style={{ color: '#34d399' }}>ONLINE</strong></span>
          <span>Reporting Lag: <strong style={{ color: '#34d399' }}>&lt; 48 Hours</strong> (was 14d)</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="navbar-container">
        
        {/* Logo & Title */}
        <div className="navbar-brand">
          <div className="brand-icon">
            <ShieldAlert style={{ width: '24px', height: '24px', color: '#67e8f9' }} />
            {criticalClusterCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid #0f172a'
              }}>
                {criticalClusterCount}
              </span>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 className="navbar-title">
                DENGUE<span>YE</span>
              </h1>
              <span style={{
                padding: '0.125rem 0.5rem',
                fontSize: '10px',
                fontWeight: 600,
                backgroundColor: '#083344',
                color: '#67e8f9',
                border: '1px solid #155e75',
                borderRadius: '9999px'
              }}>
                GVMC Vizag Pilot v1.0
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Greater Visakhapatnam Municipal Corp • Public Health Vector Control
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          <button
            onClick={() => setActiveTab('map')}
            className={`nav-button ${activeTab === 'map' ? 'nav-button-active' : ''}`}
          >
            <MapPin style={{ width: '16px', height: '16px' }} />
            <span>GIS Cluster Map</span>
          </button>

          <button
            onClick={() => setActiveTab('command')}
            className={`nav-button ${activeTab === 'command' ? 'nav-button-active' : ''}`}
          >
            <Building2 style={{ width: '16px', height: '16px' }} />
            <span>Commissioner Command</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`nav-button ${activeTab === 'dispatch' ? 'nav-button-active' : ''}`}
          >
            <Activity style={{ width: '16px', height: '16px' }} />
            <span>Vector Control Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`nav-button ${activeTab === 'analytics' ? 'nav-button-active' : ''}`}
          >
            <FileSpreadsheet style={{ width: '16px', height: '16px' }} />
            <span>Epidemiology Analytics</span>
          </button>
        </nav>

        {/* User Role Switcher & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          <button
            onClick={onOpenReportModal}
            className="btn-primary"
            title="Digitised KoBoToolbox Case Entry Form for Ward Health Officers"
          >
            <PlusCircle style={{ width: '16px', height: '16px' }} />
            <span>+ Report Case (KoBo)</span>
          </button>

          <button
            onClick={onOpenSmsModal}
            style={{
              padding: '0.5rem',
              backgroundColor: '#0f172a',
              color: '#cbd5e1',
              borderRadius: '0.5rem',
              border: '1px solid #334155',
              cursor: 'pointer'
            }}
            title="Open 48H SMS Gateway Logs"
          >
            <MessageSquare style={{ width: '16px', height: '16px' }} />
          </button>

          {/* Role Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '0.5rem',
            padding: '0.25rem 0.5rem'
          }}>
            <UserCheck style={{ width: '14px', height: '14px', color: '#22d3ee', marginRight: '6px' }} />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="role-select"
            >
              <option value="COMMISSIONER">GVMC Commissioner / COC</option>
              <option value="PUBLIC_HEALTH_SUPERVISOR">Public Health Supervisor</option>
              <option value="FIELD_HEALTH_WORKER">Ward Health Officer (ASHA/ANM)</option>
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};
