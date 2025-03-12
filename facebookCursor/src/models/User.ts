export class User {
    id: number;
    following: Set<number>; // Set of user IDs this user follows
    posts: number[]; // List of post IDs created by this user

    constructor(id: number) {
        this.id = id;
        this.following = new Set<number>();
        this.posts = [];
    }

    follow(userId: number): void {
        if (userId !== this.id) { // Users can't follow themselves
            this.following.add(userId);
        }
    }

    unfollow(userId: number): void {
        this.following.delete(userId);
    }

    addPost(postId: number): void {
        this.posts.push(postId);
    }

    removePost(postId: number): void {
        const index = this.posts.indexOf(postId);
        if (index !== -1) {
            this.posts.splice(index, 1);
        }
    }

    getFollowing(): number[] {
        return Array.from(this.following);
    }
} 