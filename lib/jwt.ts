import jwt,{ JwtPayload } from 'jsonwebtoken';

export const generateToken = (payload: object) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): { role: string } | null => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return { role: decoded.role || 'guest' };
  } catch (error) {
    return { role: 'guest' };
  }
};
