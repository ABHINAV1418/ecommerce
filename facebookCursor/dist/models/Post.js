"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(id, userId) {
        this.id = id;
        this.userId = userId;
        this.timestamp = Date.now();
    }
}
exports.Post = Post;
