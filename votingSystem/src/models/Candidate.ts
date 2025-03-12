export class Candidate {
    id: string;
    name: string;
    party: string;
    bio: string;
    imageUrl?: string;

    constructor(id: string, name: string, party: string, bio: string, imageUrl?: string) {
        this.id = id;
        this.name = name;
        this.party = party;
        this.bio = bio;
        this.imageUrl = imageUrl;
    }
} 