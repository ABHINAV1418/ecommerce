export enum UserRole {
    VOTER = 'VOTER',
    ADMIN = 'ADMIN'
}

export class User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real system, this would be hashed
    role: UserRole;
    hasVoted: Map<string, boolean>; // Map of electionId to whether user has voted

    constructor(id: string, name: string, email: string, password: string, role: UserRole = UserRole.VOTER) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.hasVoted = new Map<string, boolean>();
    }

    canVoteInElection(electionId: string): boolean {
        return !this.hasVoted.get(electionId);
    }

    markAsVoted(electionId: string): void {
        this.hasVoted.set(electionId, true);
    }

    isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }
} 