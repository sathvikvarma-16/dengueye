export type BackendRole = 'FIELD_HEALTH_WORKER' | 'PUBLIC_HEALTH_SUPERVISOR' | 'COMMISSIONER';

export interface JwtPayload {
  sub: string;
  email: string;
  phone: string;
  role: BackendRole;
  name: string;
  exp: number;
}

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    const [, payloadSegment] = token.split('.');
    const decoded = JSON.parse(atob(payloadSegment)) as JwtPayload;
    if (!decoded?.role || decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

export const requireRole = (allowedRoles: BackendRole[]) => {
  return (req: { headers?: { authorization?: string } }, res: { status: (code: number) => { json: (payload: unknown) => unknown } }, next: () => void) => {
    const authHeader = req.headers?.authorization ?? '';
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyJwt(token);

    if (!payload) {
      return res.status(401).json({ message: 'Unauthorized: invalid or expired token.' });
    }

    if (!allowedRoles.includes(payload.role)) {
      return res.status(403).json({ message: 'Forbidden: role not allowed for this endpoint.' });
    }

    next();
  };
};

export const requireCommissioner = requireRole(['COMMISSIONER']);
export const requireSupervisorOrCommissioner = requireRole(['PUBLIC_HEALTH_SUPERVISOR', 'COMMISSIONER']);
export const requireWorkerOrSupervisorOrCommissioner = requireRole(['FIELD_HEALTH_WORKER', 'PUBLIC_HEALTH_SUPERVISOR', 'COMMISSIONER']);
