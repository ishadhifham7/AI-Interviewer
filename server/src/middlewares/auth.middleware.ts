import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'ai_mentor_super_secret_key_123';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Check if header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // 2. Extract token and ensure it's not empty
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing from header." });
  }

  try {
    // 3. Explicitly pass token as string to solve the Line 21 error
    const decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload;
    
    if (decoded && typeof decoded !== 'string') {
        req.user = { id: decoded.id as string };
        next();
    } else {
        throw new Error("Invalid token payload");
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid or expired token.";
    res.status(401).json({ message });
  }
};