# Online Voting System

This is a simple Online Voting System implementation that simulates the operations of a real voting platform, including user registration, election creation, candidate management, voting, and result tabulation.

## Features

The implementation provides the following functionality:

1. User Management
   - User registration
   - User authentication (login/logout)
   - Role-based access control (Admin/Voter)

2. Election Management
   - Create elections with start and end dates
   - Add candidates to elections
   - Remove candidates from elections
   - View upcoming, ongoing, and completed elections

3. Voting
   - Cast votes in ongoing elections
   - Prevent double voting
   - Secure vote storage

4. Results and Statistics
   - View election results (for completed elections)
   - View voter turnout statistics

## Project Structure

```
votingSystem/
├── src/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Candidate.ts
│   │   ├── Election.ts
│   │   ├── Vote.ts
│   │   └── VotingSystem.ts
│   ├── services/
│   │   └── VotingService.ts
│   ├── controllers/
│   │   └── VotingController.ts
│   ├── index.ts
│   └── demo.ts
├── package.json
├── tsconfig.json
└── README.md
```

## How to Run

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Running the Demo

```bash
# Run the demo script
npm run demo
```

### Running the API Server

```bash
# Start the server
npm run dev
```

The server will start on http://localhost:3000.

## API Endpoints

### User Management

- `POST /api/users/register` - Register a new user
  - Body: `{ "name": string, "email": string, "password": string }`
- `POST /api/users/login` - Login
  - Body: `{ "email": string, "password": string }`
- `POST /api/users/logout` - Logout
- `GET /api/users/current` - Get current user
- `GET /api/users` - Get all users (admin only)

### Election Management

- `GET /api/elections` - Get all elections
- `GET /api/elections/upcoming` - Get upcoming elections
- `GET /api/elections/ongoing` - Get ongoing elections
- `GET /api/elections/completed` - Get completed elections
- `GET /api/elections/:electionId` - Get a specific election
- `POST /api/elections` - Create a new election (admin only)
  - Body: `{ "title": string, "description": string, "startDate": string, "endDate": string }`
- `POST /api/elections/:electionId/candidates` - Add a candidate to an election (admin only)
  - Body: `{ "name": string, "party": string, "bio": string, "imageUrl": string (optional) }`
- `DELETE /api/elections/:electionId/candidates/:candidateId` - Remove a candidate from an election (admin only)

### Voting

- `POST /api/vote` - Cast a vote
  - Body: `{ "electionId": string, "candidateId": string }`

### Results and Statistics

- `GET /api/elections/:electionId/results` - Get election results (for completed elections)
- `GET /api/elections/:electionId/turnout` - Get voter turnout statistics (admin only)

## Election States

1. **UPCOMING**: The election is scheduled but has not started yet
2. **ONGOING**: The election is currently in progress and accepting votes
3. **COMPLETED**: The election has ended and results are available

## User Roles

1. **VOTER**: Regular user who can vote in elections
2. **ADMIN**: Administrator who can create elections, add candidates, and view statistics

## Interview Demonstration

For an interview setting, you can use the `demo.ts` file to showcase the functionality without needing to set up HTTP requests. This file demonstrates all the required operations in a clear, sequential manner.

To run the demo:

```bash
npm run demo
```

This will output a step-by-step demonstration of the voting system operations.

## Design Patterns Used

1. **Singleton Pattern**: The VotingSystem class acts as a singleton that manages the entire system.
2. **State Pattern**: Elections have different states (UPCOMING, ONGOING, COMPLETED) with different behaviors.
3. **MVC Pattern**: The application is structured with Models, Services (business logic), and Controllers (API endpoints).

## Security Considerations

In a real-world implementation, additional security measures would be necessary:

1. Password hashing and salting
2. JWT or session-based authentication
3. HTTPS for secure communication
4. Rate limiting to prevent brute force attacks
5. Input validation and sanitization
6. Audit logs for all actions
7. Encryption of sensitive data

## Future Enhancements

1. Support for different voting methods (ranked choice, approval voting, etc.)
2. Real-time results using WebSockets
3. Email verification for user registration
4. Two-factor authentication
5. Mobile app support
6. Blockchain-based vote storage for immutability and transparency 