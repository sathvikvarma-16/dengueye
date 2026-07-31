import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  UserCheck, 
  PlusCircle, 
  MessageSquare, 
  Activity, 
  Building2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'map' | 'command' | 'dispatch' | 'analytics';
  setActiveTab: (tab: 'map' | 'command' | 'dispatch' | 'analytics') => void;
  onOpenReportModal: () => void;
  onOpenSmsModal: () => void;
  criticalClusterCount: number;
  totalActiveCases: number;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenSmsModal,
  criticalClusterCount,
  totalActiveCases,
  isExpanded,
  setIsExpanded,
  theme,
  setTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'map', label: 'GIS Cluster Map', icon: MapPin },
    { id: 'command', label: 'Commissioner Command', icon: Building2 },
    { id: 'dispatch', label: 'Vector Dispatch Ops', icon: Activity },
    { id: 'analytics', label: 'Epidemiology Analytics', icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
          <div className="navbar-brand">
            <div className="brand-icon" style={{ width: 34, height: 34 }}>
              <ShieldAlert style={{ width: 18, height: 18 }} />
            </div>
            <h1 className="navbar-title" style={{ fontSize: '1.1rem' }}>
              DENGUE<span>YE</span>
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={onOpenReportModal} className="btn-primary" style={{ padding: '0.375rem 0.625rem', fontSize: '11px' }}>
            <PlusCircle style={{ width: 14, height: 14 }} />
            <span>Report Case</span>
          </button>
        </div>
      </header>

      {/* Mobile Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-overlay-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar-container ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Header / Brand */}
        <div className="sidebar-header">
          <div className="navbar-brand">
            <div className="brand-icon">
              <ShieldAlert style={{ width: 20, height: 20 }} />
              {criticalClusterCount > 0 && (
                <span className="cluster-badge-pulse">
                  {criticalClusterCount}
                </span>
              )}
            </div>
            {isExpanded && (
              <div className="brand-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <h1 className="navbar-title">
                    DENGUE<span>YE</span>
                  </h1>
                  <span className="pilot-tag">v1.0</span>
                </div>
                <p className="sub-title">GVMC Vizag Vector Control</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="collapse-toggle-btn desktop-only"
            title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isExpanded ? <ChevronLeft style={{ width: 16, height: 16 }} /> : <ChevronRight style={{ width: 16, height: 16 }} />}
          </button>
        </div>

        {/* Emergency Ticker Indicator */}
        {isExpanded ? (
          <div className="sidebar-ticker-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--accent-red)', fontWeight: 700, fontSize: '11px' }}>
              <AlertTriangle style={{ width: 14, height: 14 }} />
              <span>GVMC SURVEILLANCE</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              <strong style={{ color: 'var(--accent-red)' }}>{criticalClusterCount} Hotspots</strong> ({totalActiveCases} cases)
            </p>
          </div>
        ) : (
          <div style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--accent-red)', display: 'flex', justifyContent: 'center' }} title={`${criticalClusterCount} Hotspots`}>
            <AlertTriangle style={{ width: 18, height: 18 }} />
          </div>
        )}

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                {isExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Primary Actions */}
        <div className="sidebar-actions">
          <button 
            onClick={() => { onOpenReportModal(); setMobileMenuOpen(false); }} 
            className="btn-primary"
            style={{ width: '100%', justifyContent: isExpanded ? 'flex-start' : 'center' }}
            title="+ Report Case (KoBoToolbox)"
          >
            <PlusCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
            {isExpanded && <span>Report Case (KoBo)</span>}
          </button>

          <button
            onClick={() => { onOpenSmsModal(); setMobileMenuOpen(false); }}
            className="sidebar-action-secondary"
            title="SMS Gateway Logs"
          >
            <MessageSquare style={{ width: 18, height: 18, flexShrink: 0 }} />
            {isExpanded && <span>SMS Gateway Logs</span>}
          </button>
        </div>

        {/* Footer with Dark/Light Theme Switcher */}
        <div className="sidebar-footer">
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {theme === 'dark' ? <Moon style={{ width: 14, height: 14, color: '#f59e0b' }} /> : <Sun style={{ width: 14, height: 14, color: '#f59e0b' }} />}
              {isExpanded && <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>}
            </div>
            {isExpanded && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Toggle</span>}
          </button>

          {/* Role Selector */}
          {isExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '11px' }}>
                <UserCheck style={{ width: 12, height: 12, color: 'var(--accent-blue)' }} />
                <span>OPERATOR ROLE</span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="role-select"
                style={{ width: '100%' }}
              >
                <option value="COMMISSIONER">GVMC Commissioner</option>
                <option value="PUBLIC_HEALTH_SUPERVISOR">Public Health Supervisor</option>
                <option value="FIELD_HEALTH_WORKER">Ward Health Worker</option>
              </select>
            </div>
          )}

        </div>

      </aside>
    </>
  );
};
