export class Auth {
    userId: number;
    username: string;
    passwordHash: string;
    
    constructor(userId: number, username: string, passwordHash: string) {
        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;
    }
} 