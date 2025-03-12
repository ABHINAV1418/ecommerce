import { Request, Response } from 'express';
import { FacebookService } from '../services/FacebookService';

export class AuthenticatedFacebookController {
    private facebookService: FacebookService;

    constructor(facebookService: FacebookService) {
        this.facebookService = facebookService;
    }

    // Create a post
    public createPost = (req: Request, res: Response): void => {
        try {
            const { postId } = req.body;
            const userId = req.user?.userId;
            
            if (!userId || !postId) {
                res.status(400).json({ error: 'userId and postId are required' });
                return;
            }

            this.facebookService.post(userId, postId);
            res.status(201).json({ message: 'Post created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create post' });
        }
    };

    // Follow a user
    public followUser = (req: Request, res: Response): void => {
        try {
            const { followeeId } = req.body;
            const followerId = req.user?.userId;
            
            if (!followerId || !followeeId) {
                res.status(400).json({ error: 'followerId and followeeId are required' });
                return;
            }

            this.facebookService.follow(followerId, followeeId);
            res.status(200).json({ message: 'User followed successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to follow user' });
        }
    };

    // Unfollow a user
    public unfollowUser = (req: Request, res: Response): void => {
        try {
            const { followeeId } = req.body;
            const followerId = req.user?.userId;
            
            if (!followerId || !followeeId) {
                res.status(400).json({ error: 'followerId and followeeId are required' });
                return;
            }

            this.facebookService.unfollow(followerId, followeeId);
            res.status(200).json({ message: 'User unfollowed successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to unfollow user' });
        }
    };

    // Get news feed
    public getNewsFeed = (req: Request, res: Response): void => {
        try {
            const userId = req.user?.userId;
            
            if (!userId) {
                res.status(400).json({ error: 'Valid userId is required' });
                return;
            }

            const feed = this.facebookService.getNewsFeed(userId);
            res.status(200).json({ feed });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get news feed' });
        }
    };

    // Get paginated news feed
    public getNewsFeedPaginated = (req: Request, res: Response): void => {
        try {
            const userId = req.user?.userId;
            const pageNumber = parseInt(req.query.page as string) || 0;
            
            if (!userId) {
                res.status(400).json({ error: 'Valid userId is required' });
                return;
            }

            const feed = this.facebookService.getNewsFeedPaginated(userId, pageNumber);
            res.status(200).json({ feed, page: pageNumber });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get paginated news feed' });
        }
    };

    // Delete a post
    public deletePost = (req: Request, res: Response): void => {
        try {
            const postId = parseInt(req.params.postId);
            const userId = req.user?.userId;
            
            if (isNaN(postId) || !userId) {
                res.status(400).json({ error: 'Valid postId and userId are required' });
                return;
            }

            // Check if the post belongs to the user before deleting
            // This is a security check to prevent users from deleting other users' posts
            const post = this.facebookService['posts'].get(postId);
            if (!post || post.userId !== userId) {
                res.status(403).json({ error: 'You can only delete your own posts' });
                return;
            }

            this.facebookService.deletePost(postId);
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete post' });
        }
    };
} 