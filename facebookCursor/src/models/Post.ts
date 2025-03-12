export class Post {
    id: number;
    userId: number;
    timestamp: number; // Unix timestamp for sorting by recency

    constructor(id: number, userId: number) {
        this.id = id;
        this.userId = userId;
        this.timestamp = Date.now();
    }
} 