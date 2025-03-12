import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                username: string;
            };
        }
    }
}

export const authMiddleware = (authService: AuthService) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Get the token from the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Unauthorized: No token provided' });
                return;
            }
            
            // Extract the token
            const token = authHeader.split(' ')[1];
            
            // Verify the token
            const decoded = authService.verifyToken(token);
            
            // Add the user to the request object
            req.user = decoded;
            
            // Continue to the next middleware or route handler
            next();
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
    };
}; 