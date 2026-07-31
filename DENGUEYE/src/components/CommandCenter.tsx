import React from 'react';
import { 
  Building2, 
  Activity, 
  Clock, 
  Zap, 
  ShieldAlert, 
  PhoneCall, 
  ArrowUpRight, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { WardInfo, GISCluster, DiseaseCase, VectorDispatchTask } from '../types';

interface CommandCenterProps {
  wards: WardInfo[];
  clusters: GISCluster[];
  cases: DiseaseCase[];
  dispatches: VectorDispatchTask[];
  onDispatchCluster: (cluster: GISCluster) => void;
  onOpenReportModal: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  wards,
  clusters,
  cases,
  dispatches,
  onDispatchCluster,
  onOpenReportModal
}) => {
  const criticalClusters = clusters.filter(c => c.riskLevel === 'CRITICAL');
  const highClusters = clusters.filter(c => c.riskLevel === 'HIGH');
  const activeCasesCount = cases.filter(c => c.status !== 'Resolved').length;

  const dengueCount = cases.filter(c => c.disease === 'Dengue').length;
  const malariaCount = cases.filter(c => c.disease === 'Malaria').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Top Banner: Commissioner's Office Status */}
      <div className="card-panel">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--accent-blue)',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                <Building2 style={{ width: '14px', height: '14px' }} />
                GVMC COMMISSIONER'S OFFICE • CITY OPERATIONS CENTER
              </span>
              <span style={{
                padding: '0.25rem 0.625rem',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--accent-green)',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)'
              }}>
                LIVE STREAMING
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.025em' }}>
              Visakhapatnam Dengue & Malaria Early Warning Command
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', maxWidth: '52rem', lineHeight: '1.5' }}>
              Real-time 10-ward surveillance replacing legacy 7–14 day hospital paper reporting with automated &lt;48h GIS spatial cluster triggers and anti-vector field team dispatching.
            </p>
          </div>

          <div>
            <button onClick={onOpenReportModal} className="btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}>
              <Zap style={{ width: '16px', height: '16px' }} />
              <span>Submit Ward Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="kpi-grid">
        
        {/* Metric 1: Detection Lag */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Detection Lag</span>
            <div className="kpi-icon">
              <Clock style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
          <div className="kpi-value">&lt; 48 Hours</div>
          <p className="kpi-subtitle">Old Hospital Process: <strong>7 to 14 days</strong> lag</p>
        </div>

        {/* Metric 2: Active Hotspot Clusters */}
        <div className="kpi-card" style={{ borderColor: 'var(--badge-alert-border)' }}>
          <div className="kpi-header">
            <span className="kpi-title" style={{ color: 'var(--accent-red)' }}>48H Active Clusters</span>
            <div className="kpi-icon" style={{ backgroundColor: 'var(--badge-alert-bg)', color: 'var(--accent-red)', borderColor: 'var(--badge-alert-border)' }}>
              <ShieldAlert style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--accent-red)' }}>
            {criticalClusters.length} Hotspots
          </div>
          <p className="kpi-subtitle">Spatial radius: <strong>500m / 48 Hours</strong> window</p>
        </div>

        {/* Metric 3: Vector Control SLA */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Anti-Vector SLA</span>
            <div className="kpi-icon">
              <Activity style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
          <div className="kpi-value">94.2%</div>
          <p className="kpi-subtitle">Active Dispatches: <strong>{dispatches.length} missions</strong></p>
        </div>

        {/* Metric 4: Total Pilot Cases */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Pilot Cases Breakdown</span>
            <div className="kpi-icon">
              <CheckCircle2 style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
          <div className="kpi-value">{activeCasesCount} Active</div>
          <p className="kpi-subtitle">
            Dengue: <strong style={{ color: 'var(--accent-red)' }}>{dengueCount}</strong> • Malaria: <strong style={{ color: 'var(--accent-purple)' }}>{malariaCount}</strong>
          </p>
        </div>

      </div>

      {/* Main Grid: Critical Hotspot Action Queue + Executive Directives */}
      <div className="dashboard-grid">
        
        {/* Left Column: 48H Cluster Alerts */}
        <div className="card-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <AlertTriangle style={{ width: '20px', height: '20px', color: 'var(--accent-red)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              48-Hour Spatial Cluster Emergency Action Queue
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {clusters.map((cluster) => (
              <div 
                key={cluster.id} 
                style={{
                  padding: '1.25rem',
                  backgroundColor: cluster.riskLevel === 'CRITICAL' ? 'var(--badge-alert-bg)' : 'var(--bg-subtle)',
                  border: `1px solid ${cluster.riskLevel === 'CRITICAL' ? 'var(--badge-alert-border)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                      <span className="badge-critical" style={{
                        backgroundColor: cluster.riskLevel === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-amber)',
                        color: '#ffffff',
                        padding: '0.25rem 0.5rem',
                        fontSize: '11px',
                        fontWeight: 800,
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {cluster.riskLevel} ALERT
                      </span>
                      <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>
                        {cluster.clusterCode} • {cluster.wardName}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                      Detected <strong style={{ color: 'var(--accent-red)' }}>{cluster.caseCount} {cluster.diseaseType} cases</strong> within 500m radius in past 48 hours.
                    </p>
                  </div>

                  <button 
                    onClick={() => onDispatchCluster(cluster)} 
                    className="btn-alert"
                    style={{ padding: '0.625rem 1rem', marginTop: '0.25rem' }}
                  >
                    <Zap style={{ width: '14px', height: '14px' }} />
                    <span>Dispatch Fogging Unit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Executive Directives */}
        <div className="card-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <Building2 style={{ width: '20px', height: '20px', color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Commissioner Budget Allocator
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.375rem', margin: '0 0 0.375rem 0' }}>
                <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                Priority 1: MVP Colony (Ward 15)
              </h4>
              <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Highest case density (7 cases). Deploy 2 extra vehicle fogging cannons.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '12px' }}>
              <div style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>INDICATIVE PILOT BUDGET:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', gap: '1rem' }}>
                <span>Budget Range:</span>
                <strong style={{ color: 'var(--text-primary)' }}>Rs 8,000 - 15,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>KoBoToolbox Forms:</span>
                <strong style={{ color: 'var(--accent-green)' }}>Free / Open Source</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Ward Leaderboard Tabular Format */}
      <div className="card-panel">
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            10 GVMC Pilot Wards - Spatial Surveillance Matrix
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Structured ward health officer data feeds, risk tiers, and active case counts
          </p>
        </div>

        <div className="table-responsive-wrapper">
          <table className="ward-data-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Ward #</th>
                <th style={{ width: '20%' }}>Ward Name</th>
                <th style={{ width: '22%' }}>Zone</th>
                <th style={{ width: '13%' }}>Risk Tier</th>
                <th style={{ width: '13%' }}>Active Cases</th>
                <th style={{ width: '22%' }}>Public Health Officer</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {wards.map((ward) => {
                const isCritical = ward.riskLevel === 'CRITICAL';
                const isHigh = ward.riskLevel === 'HIGH';
                const isModerate = ward.riskLevel === 'MODERATE';

                return (
                  <tr key={ward.id}>
                    <td className="td-mono-ward">Ward {ward.number}</td>
                    <td className="td-bold-name">{ward.name}</td>
                    <td className="td-muted">{ward.zone}</td>
                    <td>
                      <span className={`risk-pill ${isCritical ? 'risk-critical' : isHigh ? 'risk-high' : isModerate ? 'risk-moderate' : 'risk-low'}`}>
                        {ward.riskLevel}
                      </span>
                    </td>
                    <td className="td-cases">{ward.activeCasesCount} cases</td>
                    <td className="td-officer">{ward.officerName}</td>
                    <td style={{ textAlign: 'right' }}>
                      <a href={`tel:${ward.officerContact}`} className="btn-call-officer">
                        <PhoneCall style={{ width: 12, height: 12, marginRight: 4 }} />
                        Call Officer
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
