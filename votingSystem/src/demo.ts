import { VotingSystem } from './models/VotingSystem';
import { UserRole } from './models/User';
import { ElectionStatus } from './models/Election';
import { Candidate } from './models/Candidate';
import { v4 as uuidv4 } from 'uuid';

async function runDemo() {
    console.log('=== Online Voting System Demo ===\n');
    
    // Initialize the voting system
    const votingSystem = new VotingSystem();
    console.log('Voting system initialized with default admin user\n');
    
    // Login as admin
    try {
        const admin = votingSystem.login('admin@example.com', 'admin123');
        console.log(`Logged in as admin: ${admin.name} (${admin.email})\n`);
    } catch (error: any) {
        console.error(`Error logging in as admin: ${error.message}`);
        return;
    }
    
    // Register some users
    console.log('=== Registering Users ===');
    const users = [
        { name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
        { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123' },
        { name: 'Alice Brown', email: 'alice@example.com', password: 'password123' },
        { name: 'Charlie Wilson', email: 'charlie@example.com', password: 'password123' }
    ];
    
    for (const userData of users) {
        try {
            const user = votingSystem.registerUser(userData.name, userData.email, userData.password);
            console.log(`Registered user: ${user.name} (${user.email})`);
        } catch (error: any) {
            console.error(`Error registering user ${userData.name}: ${error.message}`);
        }
    }
    console.log();
    
    // Create elections
    console.log('=== Creating Elections ===');
    
    // Create an upcoming election (starts tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    let upcomingElection;
    try {
        upcomingElection = votingSystem.createElection(
            'City Council Election',
            'Election for the city council members',
            tomorrow,
            nextWeek
        );
        console.log(`Created upcoming election: ${upcomingElection.title}`);
        console.log(`Status: ${upcomingElection.status}`);
        console.log(`Start date: ${upcomingElection.startDate.toLocaleDateString()}`);
        console.log(`End date: ${upcomingElection.endDate.toLocaleDateString()}\n`);
        
        // Add candidates to the upcoming election
        console.log('=== Adding Candidates to Upcoming Election ===');
        const candidates = [
            { name: 'Michael Johnson', party: 'Progressive Party', bio: 'Former mayor with 10 years of experience.' },
            { name: 'Sarah Williams', party: 'Conservative Party', bio: 'Business owner and community leader.' },
            { name: 'David Lee', party: 'Independent', bio: 'Civil engineer and urban planning expert.' }
        ];
        
        for (const candidateData of candidates) {
            try {
                const candidate = votingSystem.addCandidateToElection(
                    upcomingElection.id,
                    candidateData.name,
                    candidateData.party,
                    candidateData.bio
                );
                console.log(`Added candidate: ${candidate.name} (${candidate.party})`);
            } catch (error: any) {
                console.error(`Error adding candidate ${candidateData.name}: ${error.message}`);
            }
        }
        console.log();
    } catch (error: any) {
        console.error(`Error creating upcoming election: ${error.message}`);
    }
    
    // Create an ongoing election (started yesterday, ends in 5 days)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
    
    let ongoingElection;
    try {
        ongoingElection = votingSystem.createElection(
            'School Board Election',
            'Election for the school board members',
            yesterday,
            fiveDaysLater
        );
        console.log(`Created ongoing election: ${ongoingElection.title}`);
        console.log(`Status: ${ongoingElection.status}`);
        console.log(`Start date: ${ongoingElection.startDate.toLocaleDateString()}`);
        console.log(`End date: ${ongoingElection.endDate.toLocaleDateString()}\n`);
        
        // Add candidates to the ongoing election
        console.log('=== Adding Candidates to Ongoing Election ===');
        const candidates = [
            { name: 'Emily Davis', party: 'Education First', bio: 'Former principal with 15 years in education.' },
            { name: 'Robert Wilson', party: 'Parents Coalition', bio: 'Parent advocate and community organizer.' },
            { name: 'Jennifer Martinez', party: 'Independent', bio: 'Education policy researcher and former teacher.' }
        ];
        
        for (const candidateData of candidates) {
            try {
                const candidate = votingSystem.addCandidateToElection(
                    ongoingElection.id,
                    candidateData.name,
                    candidateData.party,
                    candidateData.bio
                );
                console.log(`Added candidate: ${candidate.name} (${candidate.party})`);
            } catch (error: any) {
                console.error(`Error adding candidate ${candidateData.name}: ${error.message}`);
            }
        }
        console.log();
        
        // Simulate voting
        console.log('=== Simulating Voting ===');
        
        // Get all users
        const allUsers = votingSystem.getAllUsers();
        const voters = allUsers.filter(user => user.role === UserRole.VOTER);
        
        // Get candidates
        const electionCandidates = votingSystem.getElection(ongoingElection.id).getCandidates();
        
        if (electionCandidates.length === 0) {
            console.log("No candidates available for voting");
        } else {
            // Each voter casts a vote
            for (const voter of voters) {
                try {
                    // Login as the voter
                    votingSystem.login(voter.email, 'password123');
                    
                    // Randomly select a candidate
                    const randomCandidateIndex = Math.floor(Math.random() * electionCandidates.length);
                    const selectedCandidate = electionCandidates[randomCandidateIndex];
                    
                    // Cast vote
                    const vote = votingSystem.castVote(ongoingElection.id, selectedCandidate.id);
                    console.log(`${voter.name} voted for ${selectedCandidate.name}`);
                } catch (error: any) {
                    console.error(`Error casting vote for ${voter.name}: ${error.message}`);
                }
            }
        }
        console.log();
        
        // Login back as admin
        votingSystem.login('admin@example.com', 'admin123');
        
        // Get election results (this will throw an error since the election is still ongoing)
        console.log('=== Attempting to Get Results for Ongoing Election ===');
        try {
            const results = votingSystem.getElectionResults(ongoingElection.id);
            console.log('Election results:', results);
        } catch (error: any) {
            console.log(`Expected error: ${error.message}`);
        }
        console.log();
        
        // Get voter turnout
        console.log('=== Voter Turnout for Ongoing Election ===');
        try {
            const turnout = votingSystem.getVoterTurnout(ongoingElection.id);
            console.log(`Total voters: ${turnout.totalVoters}`);
            console.log(`Voted: ${turnout.votedCount}`);
            console.log(`Turnout percentage: ${turnout.percentage.toFixed(2)}%`);
        } catch (error: any) {
            console.error(`Error getting voter turnout: ${error.message}`);
        }
        console.log();
    } catch (error: any) {
        console.error(`Error creating ongoing election: ${error.message}`);
    }
    
    // Create a completed election (for demonstration purposes)
    console.log('=== Creating a Completed Election (Demo) ===');
    
    // Create dates in the past
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    let completedElection;
    try {
        // For the completed election, we'll create it with UPCOMING status first
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
        
        const threeWeeksFromNow = new Date();
        threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);
        
        // Create the election with future dates first
        completedElection = votingSystem.createElection(
            'Mayor Election',
            'Election for the city mayor',
            twoWeeksFromNow,
            threeWeeksFromNow
        );
        
        // Add candidates while it's in UPCOMING state
        console.log('=== Adding Candidates to Completed Election Demo ===');
        const completedCandidates = [
            { name: 'Thomas Anderson', party: 'Progressive Party', bio: 'City council member for 8 years.' },
            { name: 'Rebecca Clark', party: 'Conservative Party', bio: 'Business leader and philanthropist.' }
        ];
        
        let candidatesList: Candidate[] = [];
        for (const candidateData of completedCandidates) {
            try {
                const candidate = votingSystem.addCandidateToElection(
                    completedElection.id,
                    candidateData.name,
                    candidateData.party,
                    candidateData.bio
                );
                candidatesList.push(candidate);
                console.log(`Added candidate: ${candidate.name} (${candidate.party})`);
            } catch (error: any) {
                console.error(`Error adding candidate ${candidateData.name}: ${error.message}`);
            }
        }
        
        // Now manually change the dates and status to make it a completed election
        (completedElection as any).startDate = twoWeeksAgo;
        (completedElection as any).endDate = oneWeekAgo;
        (completedElection as any).status = ElectionStatus.COMPLETED;
        
        console.log(`Modified election to completed status: ${completedElection.title}`);
        console.log(`Status: ${completedElection.status}`);
        console.log(`Start date: ${completedElection.startDate.toLocaleDateString()}`);
        console.log(`End date: ${completedElection.endDate.toLocaleDateString()}\n`);
        
        // For demonstration purposes, manually set votes for the completed election
        console.log('=== Setting Demo Votes for Completed Election ===');
        
        // Get all users
        const allUsers = votingSystem.getAllUsers();
        const voters = allUsers.filter(user => user.role === UserRole.VOTER);
        
        // Manually set votes in the election's votes map
        if (candidatesList.length >= 2) {
            // Set 6 votes for the first candidate
            (completedElection as any).votes.set(candidatesList[0].id, 6);
            console.log(`Set 6 votes for ${candidatesList[0].name}`);
            
            // Set 4 votes for the second candidate
            (completedElection as any).votes.set(candidatesList[1].id, 4);
            console.log(`Set 4 votes for ${candidatesList[1].name}`);
            
            // Mark some users as having voted
            for (let i = 0; i < voters.length; i++) {
                voters[i].markAsVoted(completedElection.id);
            }
            console.log();
            
            // Get election results for the completed election
            console.log('=== Results for Completed Election ===');
            try {
                const results = votingSystem.getElectionResults(completedElection.id);
                console.log('Election results:');
                results.forEach((result, index) => {
                    console.log(`${index + 1}. ${result.candidate.name} (${result.candidate.party}): ${result.votes} votes`);
                });
            } catch (error: any) {
                console.error(`Error getting election results: ${error.message}`);
            }
            console.log();
            
            // Get voter turnout for the completed election
            console.log('=== Voter Turnout for Completed Election ===');
            try {
                const turnout = votingSystem.getVoterTurnout(completedElection.id);
                console.log(`Total voters: ${turnout.totalVoters}`);
                console.log(`Voted: ${turnout.votedCount}`);
                console.log(`Turnout percentage: ${turnout.percentage.toFixed(2)}%`);
            } catch (error: any) {
                console.error(`Error getting voter turnout: ${error.message}`);
            }
        } else {
            console.log("Not enough candidates for the completed election demo");
        }
    } catch (error: any) {
        console.error(`Error creating completed election: ${error.message}`);
    }
    
    console.log('\n=== Demo Completed ===');
}

// Run the demo
runDemo().catch(error => {
    console.error('Demo failed with error:', error);
}); 