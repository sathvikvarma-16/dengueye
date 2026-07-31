import React from 'react';
import { SMSAlertLog } from '../types';
import { MessageSquare, X, Send, Phone } from 'lucide-react';

interface SmsGatewaySimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SMSAlertLog[];
  onSendTestSms: () => void;
}

export const SmsGatewaySimulator: React.FC<SmsGatewaySimulatorProps> = ({
  isOpen,
  onClose,
  logs,
  onSendTestSms
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        <div className="modal-header" style={{ background: '#0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#0891b2', color: '#000000', borderRadius: '0.5rem', fontWeight: 700 }}>
              <MessageSquare style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#083344', color: '#67e8f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>
                GVMC SMS GATEWAY LOGS
              </span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                48-Hour Emergency SMS Gateway
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
            <span style={{ color: '#94a3b8' }}>Gateway Status: <strong style={{ color: '#34d399' }}>ACTIVE (10 Wards)</strong></span>
            <button onClick={onSendTestSms} className="btn-primary">
              <Send style={{ width: '12px', height: '12px' }} />
              <span>Simulate Broadcast SMS Alert</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ padding: '0.75rem', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#22d3ee', fontWeight: 700 }}>
                  <span>To: {log.recipientName} ({log.phoneNumber})</span>
                  <span style={{ color: '#34d399' }}>{log.status}</span>
                </div>
                <p style={{ color: '#f1f5f9', marginTop: '0.375rem', backgroundColor: '#0f172a', padding: '0.5rem', borderRadius: '0.375rem', fontSize: '11px' }}>
                  "{log.messageText}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
