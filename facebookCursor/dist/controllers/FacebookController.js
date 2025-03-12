"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookController = void 0;
const FacebookService_1 = require("../services/FacebookService");
class FacebookController {
    constructor() {
        // Follow a user
        this.followUser = (req, res) => {
            try {
                const { followerId, followeeId } = req.body;
                if (!followerId || !followeeId) {
                    res.status(400).json({ error: 'followerId and followeeId are required' });
                    return;
                }
                this.facebookService.follow(followerId, followeeId);
                res.status(200).json({ message: 'User followed successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to follow user' });
            }
        };
        // Unfollow a user
        this.unfollowUser = (req, res) => {
            try {
                const { followerId, followeeId } = req.body;
                if (!followerId || !followeeId) {
                    res.status(400).json({ error: 'followerId and followeeId are required' });
                    return;
                }
                this.facebookService.unfollow(followerId, followeeId);
                res.status(200).json({ message: 'User unfollowed successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to unfollow user' });
            }
        };
        // Get news feed
        this.getNewsFeed = (req, res) => {
            try {
                const userId = parseInt(req.params.userId);
                if (isNaN(userId)) {
                    res.status(400).json({ error: 'Valid userId is required' });
                    return;
                }
                const feed = this.facebookService.getNewsFeed(userId);
                res.status(200).json({ feed });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get news feed' });
            }
        };
        // Get paginated news feed
        this.getNewsFeedPaginated = (req, res) => {
            try {
                const userId = parseInt(req.params.userId);
                const pageNumber = parseInt(req.query.page) || 0;
                if (isNaN(userId)) {
                    res.status(400).json({ error: 'Valid userId is required' });
                    return;
                }
                const feed = this.facebookService.getNewsFeedPaginated(userId, pageNumber);
                res.status(200).json({ feed, page: pageNumber });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get paginated news feed' });
            }
        };
        // Delete a post
        this.deletePost = (req, res) => {
            try {
                const postId = parseInt(req.params.postId);
                if (isNaN(postId)) {
                    res.status(400).json({ error: 'Valid postId is required' });
                    return;
                }
                this.facebookService.deletePost(postId);
                res.status(200).json({ message: 'Post deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete post' });
            }
        };
        this.facebookService = new FacebookService_1.FacebookService();
    }
    // Create a post
    createPost(req, res) {
        try {
            const { userId, postId } = req.body;
            if (!userId || !postId) {
                res.status(400).json({ error: 'userId and postId are required' });
                return;
            }
            this.facebookService.post(userId, postId);
            res.status(201).json({ message: 'Post created successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create post' });
        }
    }
    ;
}
exports.FacebookController = FacebookController;
