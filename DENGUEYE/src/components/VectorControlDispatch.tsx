import React, { useState } from 'react';
import { VectorDispatchTask, WardInfo, GISCluster } from '../types';
import { Truck, Plus, CheckCircle2, MapPin } from 'lucide-react';

interface VectorControlDispatchProps {
  dispatches: VectorDispatchTask[];
  wards: WardInfo[];
  clusters: GISCluster[];
  onUpdateStatus: (taskId: string, newStatus: VectorDispatchTask['status']) => void;
  onCreateDispatch: (newTask: VectorDispatchTask) => void;
}

export const VectorControlDispatch: React.FC<VectorControlDispatchProps> = ({
  dispatches,
  wards,
  clusters,
  onUpdateStatus,
  onCreateDispatch
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredDispatches = dispatches.filter((d) => {
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* Header Bar */}
      <div className="card-panel" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck style={{ width: '20px', height: '20px', color: '#34d399' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              GVMC Anti-Vector Task Force Dispatch Manager
            </h2>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Dispatching thermal fogging cannons and larvicide teams to &lt;48h GIS disease clusters.
          </p>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filteredDispatches.map((task) => (
          <div key={task.id} className="card-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge-critical" style={{ backgroundColor: task.priority === 'EMERGENCY 48H' ? '#dc2626' : '#2563eb' }}>
                {task.priority}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>
                {task.status}
              </span>
            </div>

            <h4 style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
              {task.taskType}
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin style={{ width: '14px', height: '14px', color: '#f87171' }} />
              <span>{task.wardName}: {task.targetAddress}</span>
            </p>

            <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#020617', borderRadius: '0.5rem', fontSize: '11px', fontFamily: 'monospace' }}>
              <div>Team: <strong style={{ color: '#67e8f9' }}>{task.assignedTeam}</strong></div>
            </div>

            {task.status !== 'COMPLETED' && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                  className="btn-primary"
                  style={{ fontSize: '11px', padding: '0.25rem 0.5rem' }}
                >
                  <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                  <span>Mark Completed</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
