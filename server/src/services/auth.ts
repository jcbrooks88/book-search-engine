import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express'; // Importing types for Express
dotenv.config();

export interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

// Ensure secret key is loaded
const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
  throw new Error('Missing JWT_SECRET_KEY in environment variables.');
}

// Extend Express Request type to include user property
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

// Function to get user from the token
export const getUserFromToken = (authHeader?: string): JwtPayload | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Invalid or missing Authorization header.');
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('No token found in Authorization header.');
    return null;
  }

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

// Middleware function to authenticate the token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  const user = getUserFromToken(authHeader);
  if (!user) {
    res.status(403).json({ message: 'Invalid or missing token' });
    return;
  }

  req.user = user; // Attach user to request object
  next(); // Continue to the next middleware or route handler
};

// Function to sign a token
export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h', algorithm: 'HS256' });
};
