import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { DiseaseCase, GISCluster, WardInfo, VectorDispatchTask } from '../types';
import { AlertCircle, Filter, Zap, Radio, CheckCircle, PhoneCall } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createWardIcon = (risk: string, count: number) => {
  const color = risk === 'CRITICAL' ? '#ef4444' : risk === 'HIGH' ? '#f97316' : risk === 'MODERATE' ? '#eab308' : '#10b981';
  return L.divIcon({
    className: 'custom-ward-icon',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px; border: 2px solid white; box-shadow: 0 0 10px ${color};">
        ${count}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

interface GisMapProps {
  wards: WardInfo[];
  cases: DiseaseCase[];
  clusters: GISCluster[];
  dispatches: VectorDispatchTask[];
  onDispatchCluster: (cluster: GISCluster) => void;
}

export const GisMap: React.FC<GisMapProps> = ({
  wards,
  cases,
  clusters,
  dispatches,
  onDispatchCluster
}) => {
  const [selectedDisease, setSelectedDisease] = useState<string>('ALL');
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [timeFilterHours, setTimeFilterHours] = useState<number>(48);

  const filteredCases = cases.filter((c) => {
    if (selectedDisease !== 'ALL' && c.disease !== selectedDisease) return false;
    if (selectedWard !== 'ALL' && c.wardId !== selectedWard) return false;
    
    const diffHours = (new Date().getTime() - new Date(c.reportedAt).getTime()) / (1000 * 60 * 60);
    if (diffHours > timeFilterHours) return false;

    return true;
  });

  return (
    <div className="gis-wrapper">
      
      {/* GIS Control Overlay Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        pointerEvents: 'none'
      }}>
        
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          padding: '0.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #334155',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#cbd5e1', fontWeight: 600 }}>
            <Filter style={{ width: '14px', height: '14px', marginRight: '6px', color: '#22d3ee' }} />
            <span>Filters:</span>
          </div>

          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
          >
            <option value="ALL">All Diseases</option>
            <option value="Dengue">Dengue Virus</option>
            <option value="Malaria">Malaria</option>
          </select>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
          >
            <option value="ALL">All Wards</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                Ward {w.number}: {w.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{
          pointerEvents: 'auto',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          padding: '0.5rem 1rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#f87171',
          fontWeight: 700,
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle style={{ width: '16px', height: '16px' }} />
          <span>{clusters.length} Active Spatial Clusters</span>
        </div>

      </div>

      <div className="map-cluster-legend" aria-label="cluster legend">
        <span className="map-legend-chip"><span className="map-legend-dot" style={{ background: '#ef4444' }}></span>Critical</span>
        <span className="map-legend-chip"><span className="map-legend-dot" style={{ background: '#f97316' }}></span>High</span>
        <span className="map-legend-chip"><span className="map-legend-dot" style={{ background: '#eab308' }}></span>Moderate</span>
        <span className="map-legend-chip"><span className="map-legend-dot" style={{ background: '#10b981' }}></span>Low</span>
      </div>

      <MapContainer
        center={[17.740, 83.310]}
        zoom={13}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; CARTO &amp; GVMC Public Health'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {wards.map((ward) => (
          <Marker
            key={ward.id}
            position={ward.center}
            icon={createWardIcon(ward.riskLevel, ward.activeCasesCount)}
          >
            <Popup>
              <div style={{ padding: '0.25rem', fontSize: '0.75rem' }}>
                <h3 style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.875rem' }}>{ward.name}</h3>
                <p style={{ color: '#94a3b8' }}>Ward #{ward.number} • {ward.zone}</p>
                <p style={{ marginTop: '0.25rem', color: '#22d3ee', fontWeight: 700 }}>
                  Active Cases: {ward.activeCasesCount}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {clusters.map((cluster) => (
          <Circle
            key={cluster.id}
            center={[cluster.centerLat, cluster.centerLng]}
            radius={cluster.radiusMeters}
            pathOptions={{
              color: cluster.riskLevel === 'CRITICAL' ? '#ef4444' : cluster.riskLevel === 'HIGH' ? '#f97316' : cluster.riskLevel === 'MODERATE' ? '#eab308' : '#10b981',
              fillColor: cluster.riskLevel === 'CRITICAL' ? '#ef4444' : cluster.riskLevel === 'HIGH' ? '#f97316' : cluster.riskLevel === 'MODERATE' ? '#eab308' : '#10b981',
              fillOpacity: 0.2,
              weight: 3
            }}
          >
            <Popup>
              <div style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
                <h4 style={{ fontWeight: 700, color: '#f87171' }}>48H CLUSTER: {cluster.clusterCode}</h4>
                <p style={{ color: '#cbd5e1', marginTop: '0.25rem' }}>Location: {cluster.wardName}</p>
                <p style={{ color: '#ffffff', fontWeight: 700 }}>{cluster.caseCount} cases within 500m</p>
                <button
                  onClick={() => onDispatchCluster(cluster)}
                  className="btn-alert"
                  style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                >
                  <Zap style={{ width: '14px', height: '14px' }} />
                  <span>Dispatch Fogging</span>
                </button>
              </div>
            </Popup>
          </Circle>
        ))}

        {filteredCases.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lng]}
            radius={7}
            pathOptions={{
              color: '#ffffff',
              fillColor: c.disease === 'Dengue' ? '#ef4444' : '#a855f7',
              fillOpacity: 0.9,
              weight: 1.5
            }}
          />
        ))}
      </MapContainer>

    </div>
  );
};
