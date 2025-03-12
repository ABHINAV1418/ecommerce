import { Request, Response } from 'express';
import { VotingService } from '../services/VotingService';
import { UserRole } from '../models/User';

export class VotingController {
    private votingService: VotingService;

    constructor(votingService: VotingService) {
        this.votingService = votingService;
    }

    // User Management
    registerUser = (req: Request, res: Response): void => {
        try {
            const { name, email, password } = req.body;
            
            if (!name || !email || !password) {
                res.status(400).json({ error: 'Name, email, and password are required' });
                return;
            }

            const user = this.votingService.registerUser(name, email, password);
            
            // Don't return the password in the response
            const { password: _, ...userWithoutPassword } = user;
            
            res.status(201).json(userWithoutPassword);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    login = (req: Request, res: Response): void => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            const user = this.votingService.login(email, password);
            
            // Don't return the password in the response
            const { password: _, ...userWithoutPassword } = user;
            
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };

    logout = (req: Request, res: Response): void => {
        this.votingService.logout();
        res.status(200).json({ message: 'Logged out successfully' });
    };

    getCurrentUser = (req: Request, res: Response): void => {
        const user = this.votingService.getCurrentUser();
        
        if (!user) {
            res.status(401).json({ error: 'Not logged in' });
            return;
        }
        
        // Don't return the password in the response
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json(userWithoutPassword);
    };

    getAllUsers = (req: Request, res: Response): void => {
        try {
            const currentUser = this.votingService.getCurrentUser();
            
            if (!currentUser || currentUser.role !== UserRole.ADMIN) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }
            
            const users = this.votingService.getAllUsers();
            
            // Don't return passwords in the response
            const usersWithoutPasswords = users.map(user => {
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            
            res.status(200).json(usersWithoutPasswords);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Election Management
    createElection = (req: Request, res: Response): void => {
        try {
            const { title, description, startDate, endDate } = req.body;
            
            if (!title || !description || !startDate || !endDate) {
                res.status(400).json({ error: 'Title, description, start date, and end date are required' });
                return;
            }

            const election = this.votingService.createElection(
                title,
                description,
                new Date(startDate),
                new Date(endDate)
            );
            
            res.status(201).json(election);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    addCandidateToElection = (req: Request, res: Response): void => {
        try {
            const { electionId } = req.params;
            const { name, party, bio, imageUrl } = req.body;
            
            if (!electionId || !name || !party || !bio) {
                res.status(400).json({ error: 'Election ID, name, party, and bio are required' });
                return;
            }

            const candidate = this.votingService.addCandidateToElection(
                electionId,
                name,
                party,
                bio,
                imageUrl
            );
            
            res.status(201).json(candidate);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    removeCandidateFromElection = (req: Request, res: Response): void => {
        try {
            const { electionId, candidateId } = req.params;
            
            if (!electionId || !candidateId) {
                res.status(400).json({ error: 'Election ID and candidate ID are required' });
                return;
            }

            this.votingService.removeCandidateFromElection(electionId, candidateId);
            
            res.status(200).json({ message: 'Candidate removed successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getAllElections = (req: Request, res: Response): void => {
        try {
            const elections = this.votingService.getAllElections();
            res.status(200).json(elections);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getElection = (req: Request, res: Response): void => {
        try {
            const { electionId } = req.params;
            
            if (!electionId) {
                res.status(400).json({ error: 'Election ID is required' });
                return;
            }

            const election = this.votingService.getElection(electionId);
            res.status(200).json(election);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    getUpcomingElections = (req: Request, res: Response): void => {
        try {
            const elections = this.votingService.getUpcomingElections();
            res.status(200).json(elections);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getOngoingElections = (req: Request, res: Response): void => {
        try {
            const elections = this.votingService.getOngoingElections();
            res.status(200).json(elections);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getCompletedElections = (req: Request, res: Response): void => {
        try {
            const elections = this.votingService.getCompletedElections();
            res.status(200).json(elections);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Voting
    castVote = (req: Request, res: Response): void => {
        try {
            const { electionId, candidateId } = req.body;
            
            if (!electionId || !candidateId) {
                res.status(400).json({ error: 'Election ID and candidate ID are required' });
                return;
            }

            const vote = this.votingService.castVote(electionId, candidateId);
            res.status(201).json(vote);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // Results
    getElectionResults = (req: Request, res: Response): void => {
        try {
            const { electionId } = req.params;
            
            if (!electionId) {
                res.status(400).json({ error: 'Election ID is required' });
                return;
            }

            const results = this.votingService.getElectionResults(electionId);
            res.status(200).json(results);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // Statistics
    getVoterTurnout = (req: Request, res: Response): void => {
        try {
            const { electionId } = req.params;
            
            if (!electionId) {
                res.status(400).json({ error: 'Election ID is required' });
                return;
            }

            const turnout = this.votingService.getVoterTurnout(electionId);
            res.status(200).json(turnout);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
} 