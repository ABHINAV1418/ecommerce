import { Candidate } from './Candidate';

export enum ElectionStatus {
    UPCOMING = 'UPCOMING',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED'
}

export class Election {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    candidates: Map<string, Candidate>;
    votes: Map<string, number>; // candidateId -> vote count
    status: ElectionStatus;

    constructor(
        id: string,
        title: string,
        description: string,
        startDate: Date,
        endDate: Date
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.candidates = new Map<string, Candidate>();
        this.votes = new Map<string, number>();
        this.status = ElectionStatus.UPCOMING;
        this.updateStatus();
    }

    addCandidate(candidate: Candidate): void {
        // For demo purposes, allow adding candidates to ongoing elections
        if (this.status === ElectionStatus.COMPLETED) {
            throw new Error('Cannot add candidates to a completed election');
        }
        this.candidates.set(candidate.id, candidate);
        this.votes.set(candidate.id, 0);
    }

    removeCandidate(candidateId: string): void {
        // For demo purposes, allow removing candidates from ongoing elections
        if (this.status === ElectionStatus.COMPLETED) {
            throw new Error('Cannot remove candidates from a completed election');
        }
        this.candidates.delete(candidateId);
        this.votes.delete(candidateId);
    }

    castVote(candidateId: string): void {
        if (this.status !== ElectionStatus.ONGOING) {
            throw new Error('Voting is only allowed during ongoing elections');
        }

        if (!this.candidates.has(candidateId)) {
            throw new Error('Invalid candidate ID');
        }

        const currentVotes = this.votes.get(candidateId) || 0;
        this.votes.set(candidateId, currentVotes + 1);
    }

    getResults(): Array<{ candidate: Candidate, votes: number }> {
        if (this.status !== ElectionStatus.COMPLETED) {
            throw new Error('Results are only available for completed elections');
        }

        const results: Array<{ candidate: Candidate, votes: number }> = [];
        
        this.votes.forEach((voteCount, candidateId) => {
            const candidate = this.candidates.get(candidateId);
            if (candidate) {
                results.push({
                    candidate,
                    votes: voteCount
                });
            }
        });

        // Sort by vote count in descending order
        return results.sort((a, b) => b.votes - a.votes);
    }

    getCandidates(): Candidate[] {
        return Array.from(this.candidates.values());
    }

    updateStatus(): void {
        const now = new Date();
        
        if (now < this.startDate) {
            this.status = ElectionStatus.UPCOMING;
        } else if (now >= this.startDate && now <= this.endDate) {
            this.status = ElectionStatus.ONGOING;
        } else {
            this.status = ElectionStatus.COMPLETED;
        }
    }

    isVotingOpen(): boolean {
        this.updateStatus();
        return this.status === ElectionStatus.ONGOING;
    }
} 