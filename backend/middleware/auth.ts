
import { Request, Response, NextFunction } from 'express';
// Note: In a production environment, use 'jsonwebtoken'
// For this environment, we'll implement a simple verify logic
const JWT_SECRET = process.env.JWT_SECRET || 'itu-secret-key';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    // Simulated JWT verification for the academic prototype
    // Real implementation: const decoded = jwt.verify(token, JWT_SECRET);
    const decoded = JSON.parse(atob(token.split('.')[1])); 
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};
