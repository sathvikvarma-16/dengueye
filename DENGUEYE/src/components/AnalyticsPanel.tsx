import React from 'react';
import { DiseaseCase, WardInfo, GISCluster } from '../types';
import { BarChart3, Clock, Download } from 'lucide-react';

interface AnalyticsPanelProps {
  cases: DiseaseCase[];
  wards: WardInfo[];
  clusters: GISCluster[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  cases,
  wards,
  clusters
}) => {
  const dengueCases = cases.filter(c => c.disease === 'Dengue');
  const malariaCases = cases.filter(c => c.disease === 'Malaria');

  const exportToCSV = () => {
    const headers = ['Case_ID', 'Patient_Name', 'Age', 'Gender', 'Disease', 'Diagnostic_Status', 'Ward_Name', 'Address', 'Latitude', 'Longitude', 'Reported_At', 'Reporter_Name'];
    const rows = cases.map(c => [
      c.id,
      `"${c.patientName}"`,
      c.age,
      c.gender,
      c.disease,
      `"${c.diagnosticStatus}"`,
      `"${c.wardName}"`,
      `"${c.address}"`,
      c.lat,
      c.lng,
      c.reportedAt,
      `"${c.reporterName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DENGUEYE_GVMC_Surveillance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      <div className="card-panel" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 style={{ width: '20px', height: '20px', color: '#22d3ee' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              Epidemiological Surveillance & Lag Analytics
            </h2>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Comparative benchmark: 7-14 day hospital delay vs DENGUEYE &lt;48h GIS detection pipeline.
          </p>
        </div>

        <button onClick={exportToCSV} className="btn-primary">
          <Download style={{ width: '16px', height: '16px' }} />
          <span>Export GVMC CSV Report</span>
        </button>
      </div>

      <div className="card-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <Clock style={{ width: '20px', height: '20px', color: '#34d399' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
            Reporting Lag Elimination Benchmark
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(127, 29, 29, 0.2)', border: '1px solid rgba(185, 28, 28, 0.5)', borderRadius: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' }}>Legacy Hospital Process</span>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f87171', marginTop: '0.5rem', fontFamily: 'monospace' }}>
              7 to 14 Days Lag
            </div>
            <ul style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              <li>Weekly manual paper compilation from hospital admissions</li>
              <li>Community transmission spreads before clusters are flagged</li>
            </ul>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(6, 78, 59, 0.2)', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>DENGUEYE GVMC Platform</span>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#34d399', marginTop: '0.5rem', fontFamily: 'monospace' }}>
              &lt; 48 Hours Real-Time
            </div>
            <ul style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              <li>Digitised case entry from Ward Health Officers (ASHA/ANM)</li>
              <li>Automated 500m / 48h spatial-temporal cluster engine</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
