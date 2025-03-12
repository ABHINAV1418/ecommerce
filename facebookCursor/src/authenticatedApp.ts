import express from 'express';
import { AuthenticatedFacebookController } from './controllers/AuthenticatedFacebookController';
import { AuthController } from './controllers/AuthController';
import { FacebookService } from './services/FacebookService';
import { AuthService } from './services/AuthService';
import { authMiddleware } from './middleware/authMiddleware';

// Create Express app
const app = express();
const PORT = 3001; // Different port from the main app

// Middleware
app.use(express.json());

// Initialize services
const facebookService = new FacebookService();
const authService = new AuthService();

// Initialize controllers
const facebookController = new AuthenticatedFacebookController(facebookService);
const authController = new AuthController(authService, facebookService);

// Public routes (no authentication required)
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Protected routes (authentication required)
const auth = authMiddleware(authService);

// User profile route
app.get('/api/profile', auth, authController.getProfile);

// Facebook API routes
app.post('/api/post', auth, facebookController.createPost);
app.post('/api/follow', auth, facebookController.followUser);
app.post('/api/unfollow', auth, facebookController.unfollowUser);
app.get('/api/feed', auth, facebookController.getNewsFeed);
app.get('/api/feed/paginated', auth, facebookController.getNewsFeedPaginated);
app.delete('/api/post/:postId', auth, facebookController.deletePost);

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Authenticated server is running on http://localhost:${PORT}`);
    });
}

// Export for testing
export { app, facebookService, authService }; 