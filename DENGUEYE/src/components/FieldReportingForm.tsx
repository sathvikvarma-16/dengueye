import React, { useEffect, useRef, useState } from 'react';
import { DiseaseCase, WardInfo, DiseaseType, DiagnosticStatus } from '../types';
import { X, Send, Stethoscope, Camera, RefreshCw } from 'lucide-react';

interface FieldReportingFormProps {
  wards: WardInfo[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitCase: (newCase: DiseaseCase) => void;
}

export const FieldReportingForm: React.FC<FieldReportingFormProps> = ({
  wards,
  isOpen,
  onClose,
  onSubmitCase
}) => {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>(30);
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [disease, setDisease] = useState<DiseaseType>('Dengue');
  const [diagnosticStatus, setDiagnosticStatus] = useState<DiagnosticStatus>('NS1 Positive');
  const [wardId, setWardId] = useState<string>('ward-15');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(17.7430);
  const [lng, setLng] = useState<number>(83.3323);
  const [reporterName, setReporterName] = useState('A. Hymavathi (ASHA Worker)');
  const [reporterContact, setReporterContact] = useState('+91 98480 12301');
  const [cameraError, setCameraError] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const cleanAndClose = () => {
    stopCameraStream();
    setCapturedPhoto(null);
    setCameraError('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      return;
    }

    let cancelled = false;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera access is not supported in this browser. Please use a modern browser with camera permissions enabled.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment'
          },
          audio: false
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
        setCameraError('');
      } catch {
        setCameraError('Camera access is required to submit a case. Please allow camera permissions.');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopCameraStream();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCapturePhoto = () => {
    if (!videoRef.current) {
      setCameraError('Camera preview is not ready yet. Please wait a moment and retry.');
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Unable to capture the camera frame. Please try again.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPhoto(dataUrl);
    setCameraError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !address || !capturedPhoto) return;

    const ward = wards.find((w) => w.id === wardId);

    const newCase: DiseaseCase = {
      id: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      age: Number(age),
      gender,
      disease,
      diagnosticStatus,
      wardId,
      wardName: ward ? ward.name : 'GVMC Ward',
      address,
      lat,
      lng,
      reportedAt: new Date().toISOString(),
      reporterType: 'Ward Health Worker',
      reporterName,
      reporterContact,
      symptomOnsetDaysAgo: 2,
      hasMosquitoBreedingSite: true,
      status: 'Verified',
      photoProofBase64: capturedPhoto
    };

    onSubmitCase(newCase);
    cleanAndClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#059669', color: '#ffffff', borderRadius: '0.5rem' }}>
              <Stethoscope style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#064e3b', color: '#6ee7b7', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>
                GVMC KoBoToolbox Form
              </span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Ward Health Worker Disease Case Entry
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          
          <div className="form-group">
            <label className="form-label">Patient Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. K. Satish Kumar"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="form-select"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Disease Diagnosis *</label>
              <select
                value={disease}
                onChange={(e) => setDisease(e.target.value as DiseaseType)}
                className="form-select"
                style={{ fontWeight: 700 }}
              >
                <option value="Dengue">Dengue Virus (Aedes)</option>
                <option value="Malaria">Malaria (Plasmodium)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Diagnostic Status *</label>
              <select
                value={diagnosticStatus}
                onChange={(e) => setDiagnosticStatus(e.target.value as DiagnosticStatus)}
                className="form-select"
              >
                <option value="NS1 Positive">Dengue NS1 Positive</option>
                <option value="IgM Positive">Dengue IgM Positive</option>
                <option value="Smear Positive">Malaria Smear Positive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">GVMC Pilot Ward *</label>
            <select
              value={wardId}
              onChange={(e) => setWardId(e.target.value)}
              className="form-select"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward {w.number}: {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sector 4, Door 12-4, MVP Colony"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Live Photo Proof *</label>
            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '0.75rem',
              padding: '0.875rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '100%',
                minHeight: '240px',
                backgroundColor: '#020617',
                border: '1px solid #1e293b',
                borderRadius: '0.625rem',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="Captured live proof"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#020617' }}
                  />
                )}
              </div>

              {cameraError && (
                <div style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
                  {cameraError}
                </div>
              )}

              {!capturedPhoto && (
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="btn-primary"
                  style={{ width: 'fit-content' }}
                  disabled={!cameraReady}
                >
                  <Camera style={{ width: '16px', height: '16px' }} />
                  <span>Capture Photo</span>
                </button>
              )}

              {capturedPhoto && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setCapturedPhoto(null)}
                    className="btn-primary"
                    style={{ backgroundColor: '#0f766e' }}
                  >
                    <RefreshCw style={{ width: '16px', height: '16px' }} />
                    <span>Retake</span>
                  </button>
                  <span style={{ color: '#67e8f9', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    Photo proof captured successfully.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={cleanAndClose} style={{ padding: '0.5rem 1rem', backgroundColor: '#1e293b', color: '#cbd5e1', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!capturedPhoto}>
              <Send style={{ width: '16px', height: '16px' }} />
              <span>Submit Case</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
