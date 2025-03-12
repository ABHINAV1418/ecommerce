import express from 'express';
import { SplitwiseService } from './services/SplitwiseService';
import { SplitwiseController } from './controllers/SplitwiseController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize services and controllers
const splitwiseService = new SplitwiseService();
const splitwiseController = new SplitwiseController(splitwiseService);

// User routes
app.post('/api/users/register', splitwiseController.registerUser);
app.post('/api/users/login', splitwiseController.login);
app.post('/api/users/logout', splitwiseController.logout);
app.get('/api/users/current', splitwiseController.getCurrentUser);
app.get('/api/users/:userId', splitwiseController.getUserById);
app.get('/api/users', splitwiseController.getAllUsers);

// Friend routes
app.post('/api/friends', splitwiseController.addFriend);
app.delete('/api/friends/:friendId', splitwiseController.removeFriend);
app.get('/api/friends', splitwiseController.getFriends);

// Group routes
app.post('/api/groups', splitwiseController.createGroup);
app.get('/api/groups/:groupId', splitwiseController.getGroup);
app.get('/api/groups', splitwiseController.getAllGroups);
app.get('/api/user/groups', splitwiseController.getUserGroups);
app.post('/api/groups/:groupId/users', splitwiseController.addUserToGroup);
app.delete('/api/groups/:groupId/users/:userId', splitwiseController.removeUserFromGroup);
app.delete('/api/groups/:groupId/leave', splitwiseController.leaveGroup);
app.delete('/api/groups/:groupId', splitwiseController.deleteGroup);

// Expense routes
app.post('/api/expenses', splitwiseController.createExpense);
app.get('/api/expenses/:expenseId', splitwiseController.getExpense);
app.get('/api/expenses', splitwiseController.getAllExpenses);
app.get('/api/user/expenses', splitwiseController.getUserExpenses);
app.get('/api/groups/:groupId/expenses', splitwiseController.getGroupExpenses);
app.delete('/api/expenses/:expenseId', splitwiseController.deleteExpense);

// Settlement routes
app.post('/api/settlements', splitwiseController.createSettlement);
app.post('/api/settlements/:settlementId/complete', splitwiseController.completeSettlement);
app.post('/api/settlements/:settlementId/cancel', splitwiseController.cancelSettlement);
app.get('/api/settlements/:settlementId', splitwiseController.getSettlement);
app.get('/api/settlements', splitwiseController.getAllSettlements);
app.get('/api/user/settlements', splitwiseController.getUserSettlements);

// Balance routes
app.get('/api/user/balances', splitwiseController.getUserBalances);
app.get('/api/user/balance/total', splitwiseController.getTotalBalance);

// Simplify debts
app.get('/api/simplify-debts', splitwiseController.simplifyDebts);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 