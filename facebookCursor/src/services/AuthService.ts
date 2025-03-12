import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Auth } from '../models/Auth';

export class AuthService {
    private auths: Map<string, Auth>; // username -> Auth
    private readonly JWT_SECRET = 'facebook-lld-secret-key'; // In a real app, this would be in env vars
    private readonly SALT_ROUNDS = 10;
    
    constructor() {
        this.auths = new Map<string, Auth>();
    }
    
    /**
     * Register a new user
     */
    public async register(userId: number, username: string, password: string): Promise<{ token: string }> {
        // Check if username already exists
        if (this.auths.has(username)) {
            throw new Error('Username already exists');
        }
        
        // Hash the password
        const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);
        
        // Create a new auth record
        const auth = new Auth(userId, username, passwordHash);
        this.auths.set(username, auth);
        
        // Generate and return a JWT token
        const token = this.generateToken(auth);
        return { token };
    }
    
    /**
     * Login a user
     */
    public async login(username: string, password: string): Promise<{ token: string, userId: number }> {
        // Check if username exists
        const auth = this.auths.get(username);
        if (!auth) {
            throw new Error('Invalid username or password');
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, auth.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        
        // Generate and return a JWT token
        const token = this.generateToken(auth);
        return { token, userId: auth.userId };
    }
    
    /**
     * Verify a JWT token
     */
    public verifyToken(token: string): { userId: number, username: string } {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: number, username: string };
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
    
    /**
     * Generate a JWT token
     */
    private generateToken(auth: Auth): string {
        const payload = {
            userId: auth.userId,
            username: auth.username
        };
        
        return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '1h' });
    }
} 