import { Request, Response } from 'express';
import { FacebookService } from '../services/FacebookService';

export class FacebookController {
    private facebookService: FacebookService;

    constructor() {
        this.facebookService = new FacebookService();
    }

    // Create a post
    public createPost (req: Request, res: Response) : void {
        try {
            const { userId, postId } = req.body;
            
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
            const { followerId, followeeId } = req.body;
            
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
            const { followerId, followeeId } = req.body;
            
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
            const userId = parseInt(req.params.userId);
            
            if (isNaN(userId)) {
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
            const userId = parseInt(req.params.userId);
            const pageNumber = parseInt(req.query.page as string) || 0;
            
            if (isNaN(userId)) {
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
            
            if (isNaN(postId)) {
                res.status(400).json({ error: 'Valid postId is required' });
                return;
            }

            this.facebookService.deletePost(postId);
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete post' });
        }
    };
} 