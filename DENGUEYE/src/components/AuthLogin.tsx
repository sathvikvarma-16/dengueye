import React, { useState } from 'react';
import { AuthenticatedUser } from '../auth/sampleUsers';
import { loginWithCredentials, saveSession } from '../auth/session';
import { X, LockKeyhole } from 'lucide-react';

interface AuthLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: AuthenticatedUser) => void;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [identifier, setIdentifier] = useState('worker1@gvmc.gov.in');
  const [password, setPassword] = useState('Worker1@GVMC');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedIdentifier = identifier.trim();
    const normalizedPassword = password.trim();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          email: normalizedIdentifier,
          password: normalizedPassword,
        }),
      });

      if (response.ok) {
        const payload = await response.json() as { token?: string; user?: { email?: string; role?: string; name?: string } };
        const backendUser = payload.user;
        const mappedUser = {
          id: backendUser?.email ?? normalizedIdentifier,
          fullName: backendUser?.name ?? normalizedIdentifier,
          email: backendUser?.email ?? normalizedIdentifier,
          phone: normalizedIdentifier,
          password: normalizedPassword,
          role: (backendUser?.role as any) ?? 'FIELD_HEALTH_WORKER',
          isActive: true,
        };

        saveSession(mappedUser);
        onAuthenticated(mappedUser);
        onClose();
        return;
      }
    } catch {
      // fall back to local demo login when the backend is not yet available
    }

    const user = loginWithCredentials(normalizedIdentifier, normalizedPassword);

    if (!user) {
      setError('Invalid credentials. Please retry with a valid email, phone number, and matching password.');
      return;
    }

    saveSession(user);
    onAuthenticated(user);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '0.5rem' }}>
              <LockKeyhole style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#082f49', color: '#67e8f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>
                Role-Based Access Login
              </span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                DenguEye secure sign-in
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="modal-body">
          <div className="form-group">
            <label className="form-label">Email / Phone *</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="form-input"
              placeholder="worker1@gvmc.gov.in or +91 98480 12301"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div style={{ color: '#fca5a5', fontSize: '0.75rem', fontWeight: 700 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-primary" style={{ backgroundColor: '#1e293b' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
