import express from 'express';
import { VotingService } from './services/VotingService';
import { VotingController } from './controllers/VotingController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize services and controllers
const votingService = new VotingService();
const votingController = new VotingController(votingService);

// User routes
app.post('/api/users/register', votingController.registerUser);
app.post('/api/users/login', votingController.login);
app.post('/api/users/logout', votingController.logout);
app.get('/api/users/current', votingController.getCurrentUser);
app.get('/api/users', votingController.getAllUsers);

// Election routes
app.get('/api/elections', votingController.getAllElections);
app.get('/api/elections/upcoming', votingController.getUpcomingElections);
app.get('/api/elections/ongoing', votingController.getOngoingElections);
app.get('/api/elections/completed', votingController.getCompletedElections);
app.get('/api/elections/:electionId', votingController.getElection);
app.post('/api/elections', votingController.createElection);
app.post('/api/elections/:electionId/candidates', votingController.addCandidateToElection);
app.delete('/api/elections/:electionId/candidates/:candidateId', votingController.removeCandidateFromElection);

// Voting routes
app.post('/api/vote', votingController.castVote);

// Results routes
app.get('/api/elections/:electionId/results', votingController.getElectionResults);
app.get('/api/elections/:electionId/turnout', votingController.getVoterTurnout);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 