import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express'; // Importing types for Express
dotenv.config();

export interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || '';

// Function to get user from the token
export const getUserFromToken = (authHeader?: string): JwtPayload | null => {
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

// Middleware function to authenticate the token with types for req, res, and next
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => { // Added return type 'void'
  const authHeader = req.headers.authorization;

  const user = getUserFromToken(authHeader);
  if (!user) {
    res.status(403).json({ message: 'Invalid or missing token' });
    return;
  }

  req.user = user;  // Attach the user to the request object
  next();  // Continue to the next middleware or route handler
};

// Function to sign a token
export const signToken = (username: string, email: string, _id: unknown): string => { // Explicitly define return type
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h', algorithm: 'HS256' });
};
