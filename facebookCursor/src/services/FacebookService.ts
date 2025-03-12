import { User } from '../models/User';
import { Post } from '../models/Post';

export class FacebookService {
    private users: Map<number, User>;
    private posts: Map<number, Post>;
    private readonly FEED_PAGE_SIZE = 10; // Number of posts per page

    constructor() {
        this.users = new Map<number, User>();
        this.posts = new Map<number, Post>();
    }

    // Helper method to ensure a user exists
    private ensureUserExists(userId: number): User {
        if (!this.users.has(userId)) {
            this.users.set(userId, new User(userId));
        }
        return this.users.get(userId)!;
    }

    // API 1: Post a new post
    public post(userId: number, postId: number): void {
        const user = this.ensureUserExists(userId);
        
        // Create a new post
        const newPost = new Post(postId, userId);
        this.posts.set(postId, newPost);
        
        // Add post to user's posts
        user.addPost(postId);
    }

    // API 2: Follow another user
    public follow(followerId: number, followeeId: number): void {
        // Ensure both users exist
        const follower = this.ensureUserExists(followerId);
        this.ensureUserExists(followeeId);
        
        // Add followee to follower's following list
        follower.follow(followeeId);
    }

    // API 3: Unfollow another user
    public unfollow(followerId: number, followeeId: number): void {
        // Check if follower exists
        if (this.users.has(followerId)) {
            const follower = this.users.get(followerId)!;
            follower.unfollow(followeeId);
        }
    }

    // API 4: Get news feed for a user
    public getNewsFeed(userId: number): number[] {
        return this.getNewsFeedPaginated(userId, 0);
    }

    // API 5: Get paginated news feed for a user
    public getNewsFeedPaginated(userId: number, pageNumber: number): number[] {
        // Ensure user exists
        const user = this.ensureUserExists(userId);
        
        // Get all posts from the user and their followings
        const relevantPosts: Post[] = [];
        
        // Add user's own posts
        for (const postId of user.posts) {
            if (this.posts.has(postId)) {
                relevantPosts.push(this.posts.get(postId)!);
            }
        }
        
        // Add posts from users they follow
        for (const followeeId of user.getFollowing()) {
            const followee = this.users.get(followeeId);
            if (followee) {
                for (const postId of followee.posts) {
                    if (this.posts.has(postId)) {
                        relevantPosts.push(this.posts.get(postId)!);
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
    public deletePost(postId: number): void {
        if (this.posts.has(postId)) {
            const post = this.posts.get(postId)!;
            const userId = post.userId;
            
            // Remove post from user's posts
            if (this.users.has(userId)) {
                const user = this.users.get(userId)!;
                user.removePost(postId);
            }
            
            // Remove post from posts map
            this.posts.delete(postId);
        }
    }
} 