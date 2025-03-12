import { User, UserRole } from './User';
import { Candidate } from './Candidate';
import { Election, ElectionStatus } from './Election';
import { Vote } from './Vote';
import { v4 as uuidv4 } from 'uuid';

export class VotingSystem {
    private users: Map<string, User>;
    private elections: Map<string, Election>;
    private votes: Vote[];
    private currentUser: User | null;

    constructor() {
        this.users = new Map<string, User>();
        this.elections = new Map<string, Election>();
        this.votes = [];
        this.currentUser = null;
        
        // Create a default admin user
        const adminId = uuidv4();
        const adminUser = new User(
            adminId,
            'Admin',
            'admin@example.com',
            'admin123', // In a real system, this would be hashed
            UserRole.ADMIN
        );
        this.users.set(adminId, adminUser);
    }

    // User Management
    registerUser(name: string, email: string, password: string): User {
        // Check if email already exists
        const existingUser = Array.from(this.users.values()).find(user => user.email === email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const userId = uuidv4();
        const newUser = new User(userId, name, email, password);
        this.users.set(userId, newUser);
        return newUser;
    }

    login(email: string, password: string): User {
        const user = Array.from(this.users.values()).find(
            user => user.email === email && user.password === password
        );

        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = user;
        return user;
    }

    logout(): void {
        this.currentUser = null;
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    // Election Management
    createElection(title: string, description: string, startDate: Date, endDate: Date): Election {
        if (!this.currentUser || !this.currentUser.isAdmin()) {
            throw new Error('Only admins can create elections');
        }

        if (startDate >= endDate) {
            throw new Error('End date must be after start date');
        }

        const electionId = uuidv4();
        const newElection = new Election(electionId, title, description, startDate, endDate);
        this.elections.set(electionId, newElection);
        return newElection;
    }

    addCandidateToElection(electionId: string, name: string, party: string, bio: string, imageUrl?: string): Candidate {
        if (!this.currentUser || !this.currentUser.isAdmin()) {
            throw new Error('Only admins can add candidates');
        }

        const election = this.elections.get(electionId);
        if (!election) {
            throw new Error('Election not found');
        }

        const candidateId = uuidv4();
        const newCandidate = new Candidate(candidateId, name, party, bio, imageUrl);
        
        try {
            election.addCandidate(newCandidate);
            return newCandidate;
        } catch (error) {
            throw error;
        }
    }

    removeCandidateFromElection(electionId: string, candidateId: string): void {
        if (!this.currentUser || !this.currentUser.isAdmin()) {
            throw new Error('Only admins can remove candidates');
        }

        const election = this.elections.get(electionId);
        if (!election) {
            throw new Error('Election not found');
        }

        try {
            election.removeCandidate(candidateId);
        } catch (error) {
            throw error;
        }
    }

    getAllElections(): Election[] {
        // Update status of all elections before returning
        this.elections.forEach(election => election.updateStatus());
        return Array.from(this.elections.values());
    }

    getElection(electionId: string): Election {
        const election = this.elections.get(electionId);
        if (!election) {
            throw new Error('Election not found');
        }
        
        election.updateStatus();
        return election;
    }

    getUpcomingElections(): Election[] {
        return this.getAllElections().filter(election => election.status === ElectionStatus.UPCOMING);
    }

    getOngoingElections(): Election[] {
        return this.getAllElections().filter(election => election.status === ElectionStatus.ONGOING);
    }

    getCompletedElections(): Election[] {
        return this.getAllElections().filter(election => election.status === ElectionStatus.COMPLETED);
    }

    // Voting
    castVote(electionId: string, candidateId: string): Vote {
        if (!this.currentUser) {
            throw new Error('You must be logged in to vote');
        }

        const election = this.elections.get(electionId);
        if (!election) {
            throw new Error('Election not found');
        }

        if (!election.isVotingOpen()) {
            throw new Error('Voting is not currently open for this election');
        }

        if (!this.currentUser.canVoteInElection(electionId)) {
            throw new Error('You have already voted in this election');
        }

        try {
            election.castVote(candidateId);
            
            const voteId = uuidv4();
            const vote = new Vote(voteId, electionId, candidateId, this.currentUser.id);
            this.votes.push(vote);
            
            this.currentUser.markAsVoted(electionId);
            
            return vote;
        } catch (error) {
            throw error;
        }
    }

    // Results
    getElectionResults(electionId: string): Array<{ candidate: Candidate, votes: number }> {
        if (!this.currentUser) {
            throw new Error('You must be logged in to view results');
        }

        const election = this.elections.get(electionId);
        if (!election) {
            throw new Error('Election not found');
        }

        try {
            return election.getResults();
        } catch (error) {
            throw error;
        }
    }

    // Statistics
    getVoterTurnout(electionId: string): { totalVoters: number, votedCount: number, percentage: number } {
        if (!this.currentUser || !this.currentUser.isAdmin()) {
            throw new Error('Only admins can view voter turnout statistics');
        }

        const election = this.elections.get(electionId);
        if (!election) {
            throw new Error('Election not found');
        }

        const totalVoters = this.users.size;
        const votedCount = Array.from(this.users.values())
            .filter(user => user.hasVoted.get(electionId))
            .length;
        
        const percentage = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

        return {
            totalVoters,
            votedCount,
            percentage
        };
    }
} 