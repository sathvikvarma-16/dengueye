import React from 'react';
import { DiseaseCase, WardInfo, GISCluster, PhotoEvidenceAsset } from '../types';
import { BarChart3, Clock, Download, Image as ImageIcon } from 'lucide-react';

interface AnalyticsPanelProps {
  cases: DiseaseCase[];
  wards: WardInfo[];
  clusters: GISCluster[];
  photoAssets: PhotoEvidenceAsset[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  cases,
  wards,
  clusters,
  photoAssets,
}) => {
  const dengueCases = cases.filter(c => c.disease === 'Dengue');
  const malariaCases = cases.filter(c => c.disease === 'Malaria');
  const latestPhotoAsset = photoAssets[0];
  const photoLookup = new Map(photoAssets.map(asset => [asset.caseId, asset]));
  const allCaseHistory = [...cases].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

  const exportToCSV = () => {
    const headers = ['Case_ID', 'Patient_Name', 'Age', 'Gender', 'Disease', 'Diagnostic_Status', 'Ward_Name', 'Address', 'Latitude', 'Longitude', 'Reported_At', 'Reporter_Name', 'Photo_Asset_ID', 'Photo_Stored_At'];
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
      `"${c.reporterName}"`,
      c.photoAssetId ?? '',
      c.photoStoredAt ?? ''
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

      <div className="card-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <ImageIcon style={{ width: '20px', height: '20px', color: '#67e8f9' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
            Case History & Uploaded Live Photo Evidence
          </h3>
        </div>

        {photoAssets.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            No live-photo evidence is currently stored in the browser record set.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#020617', border: '1px solid #0ea5e9', borderRadius: '0.9rem', overflow: 'hidden', boxShadow: '0 10px 24px rgba(14, 165, 233, 0.12)' }}>
              <div style={{ padding: '0.75rem 0.875rem', color: '#67e8f9', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>
                Latest Uploaded Proof
              </div>
              <div style={{ padding: '0.9rem', background: 'linear-gradient(180deg, rgba(2,6,23,0.92), rgba(14,116,144,0.18))' }}>
                <img src={latestPhotoAsset?.dataUrl} alt={latestPhotoAsset?.patientName ?? 'Latest proof'} style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', display: 'block', borderRadius: '0.55rem', backgroundColor: '#020617' }} />
              </div>
              <div style={{ padding: '0.85rem 0.95rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.78rem' }}>{latestPhotoAsset?.patientName}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.68rem' }}>{latestPhotoAsset?.wardName}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.66rem' }}>{latestPhotoAsset?.reporterName}</div>
                <div style={{ color: '#67e8f9', fontSize: '0.62rem' }}>{latestPhotoAsset?.capturedAt}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ color: '#67e8f9', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                All Case History Entries
              </div>

              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollSnapType: 'x proximity' }}>
                {allCaseHistory.map((entry) => {
                  const asset = photoLookup.get(entry.id);
                  return (
                    <div key={entry.id} style={{ minWidth: '260px', maxWidth: '260px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '0.9rem', overflow: 'hidden', scrollSnapAlign: 'start' }}>
                      {asset ? (
                        <img src={asset.dataUrl} alt={`${entry.patientName} case history proof`} style={{ width: '100%', height: '168px', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: '100%', height: '168px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.72rem' }}>
                          No uploaded photo
                        </div>
                      )}
                      <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.74rem' }}>{entry.patientName}</div>
                        <div style={{ color: '#cbd5e1', fontSize: '0.66rem' }}>Ward: {entry.wardName}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.66rem' }}>Reporter: {entry.reporterName}</div>
                        <div style={{ color: '#67e8f9', fontSize: '0.62rem' }}>Status: {entry.status}</div>
                        <div style={{ color: '#f59e0b', fontSize: '0.62rem' }}>Case ID: {entry.id}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.62rem' }}>Reported: {entry.reportedAt}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
