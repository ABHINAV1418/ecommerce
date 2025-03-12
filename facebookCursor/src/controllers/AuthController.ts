import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { FacebookService } from '../services/FacebookService';

export class AuthController {
    private authService: AuthService;
    private facebookService: FacebookService;
    private nextUserId: number = 1; // Simple user ID generator

    constructor(authService: AuthService, facebookService: FacebookService) {
        this.authService = authService;
        this.facebookService = facebookService;
    }

    /**
     * Register a new user
     */
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                res.status(400).json({ error: 'Username and password are required' });
                return;
            }
            
            // Generate a new user ID
            const userId = this.nextUserId++;
            
            // Register the user
            const { token } = await this.authService.register(userId, username, password);
            
            res.status(201).json({ 
                message: 'User registered successfully',
                token,
                userId
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    /**
     * Login a user
     */
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                res.status(400).json({ error: 'Username and password are required' });
                return;
            }
            
            // Login the user
            const { token, userId } = await this.authService.login(username, password);
            
            res.status(200).json({ 
                message: 'Login successful',
                token,
                userId
            });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };

    /**
     * Get the current user's profile
     */
    public getProfile = (req: Request, res: Response): void => {
        try {
            // The user is already authenticated by the middleware
            const { userId, username } = req.user!;
            
            res.status(200).json({ 
                userId,
                username
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
} 