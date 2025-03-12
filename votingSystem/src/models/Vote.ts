export class Vote {
    id: string;
    electionId: string;
    candidateId: string;
    userId: string;
    timestamp: Date;

    constructor(id: string, electionId: string, candidateId: string, userId: string) {
        this.id = id;
        this.electionId = electionId;
        this.candidateId = candidateId;
        this.userId = userId;
        this.timestamp = new Date();
    }
} 