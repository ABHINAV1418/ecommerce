"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookService = void 0;
const User_1 = require("../models/User");
const Post_1 = require("../models/Post");
class FacebookService {
    constructor() {
        this.FEED_PAGE_SIZE = 10; // Number of posts per page
        this.users = new Map();
        this.posts = new Map();
    }
    // Helper method to ensure a user exists
    ensureUserExists(userId) {
        if (!this.users.has(userId)) {
            this.users.set(userId, new User_1.User(userId));
        }
        return this.users.get(userId);
    }
    // API 1: Post a new post
    post(userId, postId) {
        const user = this.ensureUserExists(userId);
        // Create a new post
        const newPost = new Post_1.Post(postId, userId);
        this.posts.set(postId, newPost);
        // Add post to user's posts
        user.addPost(postId);
    }
    // API 2: Follow another user
    follow(followerId, followeeId) {
        // Ensure both users exist
        const follower = this.ensureUserExists(followerId);
        this.ensureUserExists(followeeId);
        // Add followee to follower's following list
        follower.follow(followeeId);
    }
    // API 3: Unfollow another user
    unfollow(followerId, followeeId) {
        // Check if follower exists
        if (this.users.has(followerId)) {
            const follower = this.users.get(followerId);
            follower.unfollow(followeeId);
        }
    }
    // API 4: Get news feed for a user
    getNewsFeed(userId) {
        return this.getNewsFeedPaginated(userId, 0);
    }
    // API 5: Get paginated news feed for a user
    getNewsFeedPaginated(userId, pageNumber) {
        // Ensure user exists
        const user = this.ensureUserExists(userId);
        // Get all posts from the user and their followings
        const relevantPosts = [];
        // Add user's own posts
        for (const postId of user.posts) {
            if (this.posts.has(postId)) {
                relevantPosts.push(this.posts.get(postId));
            }
        }
        // Add posts from users they follow
        for (const followeeId of user.getFollowing()) {
            const followee = this.users.get(followeeId);
            if (followee) {
                for (const postId of followee.posts) {
                    if (this.posts.has(postId)) {
                        relevantPosts.push(this.posts.get(postId));
                    }
                }
            }
        }
        // Sort posts by timestamp (most recent first)
        relevantPosts.sort((a, b) => b.timestamp - a.timestamp);
        // Apply pagination
        const startIndex = pageNumber * this.FEED_PAGE_SIZE;
        const endIndex = startIndex + this.FEED_PAGE_SIZE;
        // Return post IDs for the requested page
        return relevantPosts
            .slice(startIndex, endIndex)
            .map(post => post.id);
    }
    // API 6: Delete a post
    deletePost(postId) {
        if (this.posts.has(postId)) {
            const post = this.posts.get(postId);
            const userId = post.userId;
            // Remove post from user's posts
            if (this.users.has(userId)) {
                const user = this.users.get(userId);
                user.removePost(postId);
            }
            // Remove post from posts map
            this.posts.delete(postId);
        }
    }
}
exports.FacebookService = FacebookService;
