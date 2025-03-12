# Splitwise Application

A low-level design implementation of a Splitwise-like expense sharing application built with TypeScript and Express.

## Features

- **User Management**: Register, login, and manage user profiles
- **Friend Management**: Add and remove friends
- **Group Management**: Create groups and add members
- **Expense Management**: Create and manage expenses with different split types
- **Settlement Management**: Create and complete settlements between users
- **Balance Tracking**: Track balances between users
- **Debt Simplification**: Simplify debts to minimize the number of transactions

## Project Structure

```
splitwise/
├── src/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Group.ts
│   │   ├── Expense.ts
│   │   ├── Settlement.ts
│   │   └── SplitwiseSystem.ts
│   ├── services/
│   │   └── SplitwiseService.ts
│   ├── controllers/
│   │   └── SplitwiseController.ts
│   ├── index.ts
│   └── demo.ts
├── package.json
└── tsconfig.json
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
cd splitwise
npm install
```

## Usage

### Running the Demo

To run the demo script that showcases the functionality:

```bash
npm run demo
```

The demo will:
- Register users
- Add friends
- Create groups
- Add expenses
- Check balances
- Create and complete settlements
- Simplify debts

### Running the API Server

To start the API server:

```bash
npm run dev
```

The server will start on port 3000 (or the port specified in the environment variable).

## API Endpoints

### User Management
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user

### Friend Management
- `POST /api/friends` - Add a friend
- `DELETE /api/friends/:friendEmail` - Remove a friend
- `GET /api/friends` - Get all friends

### Group Management
- `POST /api/groups` - Create a new group
- `POST /api/groups/:groupId/members` - Add a member to a group
- `DELETE /api/groups/:groupId/members/:userEmail` - Remove a member from a group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:groupId` - Get a specific group

### Expense Management
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:expenseId` - Get a specific expense
- `GET /api/groups/:groupId/expenses` - Get all expenses for a group

### Settlement Management
- `POST /api/settlements` - Create a new settlement
- `PUT /api/settlements/:settlementId/complete` - Complete a settlement
- `GET /api/settlements` - Get all settlements
- `GET /api/settlements/:settlementId` - Get a specific settlement

### Balance Management
- `GET /api/user/balances` - Get balances for the current user
- `GET /api/user/balance/total` - Get total balance for the current user

### Debt Simplification
- `GET /api/simplify-debts` - Get simplified debts

## License

ISC 