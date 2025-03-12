import express from 'express';
import { FacebookController } from './controllers/FacebookController';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize controller
const facebookController = new FacebookController();

// Routes
app.post('/api/post', facebookController.createPost);
app.post('/api/follow', facebookController.followUser);
app.post('/api/unfollow', facebookController.unfollowUser);
app.get('/api/feed/:userId', facebookController.getNewsFeed);
app.get('/api/feed/:userId/paginated', facebookController.getNewsFeedPaginated);
app.delete('/api/post/:postId', facebookController.deletePost);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// For demonstration purposes, let's also expose the API directly
// This allows us to test the API without HTTP requests
export const facebookService = facebookController['facebookService']; 