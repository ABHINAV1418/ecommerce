import { VotingSystem } from '../models/VotingSystem';
import { User } from '../models/User';
import { Candidate } from '../models/Candidate';
import { Election } from '../models/Election';
import { Vote } from '../models/Vote';

export class VotingService {
    private votingSystem: VotingSystem;

    constructor() {
        this.votingSystem = new VotingSystem();
    }

    // User Management
    registerUser(name: string, email: string, password: string): User {
        try {
            return this.votingSystem.registerUser(name, email, password);
        } catch (error) {
            throw error;
        }
    }

    login(email: string, password: string): User {
        try {
            return this.votingSystem.login(email, password);
        } catch (error) {
            throw error;
        }
    }

    logout(): void {
        this.votingSystem.logout();
    }

    getCurrentUser(): User | null {
        return this.votingSystem.getCurrentUser();
    }

    getAllUsers(): User[] {
        return this.votingSystem.getAllUsers();
    }

    // Election Management
    createElection(title: string, description: string, startDate: Date, endDate: Date): Election {
        try {
            return this.votingSystem.createElection(title, description, startDate, endDate);
        } catch (error) {
            throw error;
        }
    }

    addCandidateToElection(electionId: string, name: string, party: string, bio: string, imageUrl?: string): Candidate {
        try {
            return this.votingSystem.addCandidateToElection(electionId, name, party, bio, imageUrl);
        } catch (error) {
            throw error;
        }
    }

    removeCandidateFromElection(electionId: string, candidateId: string): void {
        try {
            this.votingSystem.removeCandidateFromElection(electionId, candidateId);
        } catch (error) {
            throw error;
        }
    }

    getAllElections(): Election[] {
        return this.votingSystem.getAllElections();
    }

    getElection(electionId: string): Election {
        try {
            return this.votingSystem.getElection(electionId);
        } catch (error) {
            throw error;
        }
    }

    getUpcomingElections(): Election[] {
        return this.votingSystem.getUpcomingElections();
    }

    getOngoingElections(): Election[] {
        return this.votingSystem.getOngoingElections();
    }

    getCompletedElections(): Election[] {
        return this.votingSystem.getCompletedElections();
    }

    // Voting
    castVote(electionId: string, candidateId: string): Vote {
        try {
            return this.votingSystem.castVote(electionId, candidateId);
        } catch (error) {
            throw error;
        }
    }

    // Results
    getElectionResults(electionId: string): Array<{ candidate: Candidate, votes: number }> {
        try {
            return this.votingSystem.getElectionResults(electionId);
        } catch (error) {
            throw error;
        }
    }

    // Statistics
    getVoterTurnout(electionId: string): { totalVoters: number, votedCount: number, percentage: number } {
        try {
            return this.votingSystem.getVoterTurnout(electionId);
        } catch (error) {
            throw error;
        }
    }
} 