"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id) {
        this.id = id;
        this.following = new Set();
        this.posts = [];
    }
    follow(userId) {
        if (userId !== this.id) { // Users can't follow themselves
            this.following.add(userId);
        }
    }
    unfollow(userId) {
        this.following.delete(userId);
    }
    addPost(postId) {
        this.posts.push(postId);
    }
    removePost(postId) {
        const index = this.posts.indexOf(postId);
        if (index !== -1) {
            this.posts.splice(index, 1);
        }
    }
    getFollowing() {
        return Array.from(this.following);
    }
}
exports.User = User;
