import { Request, Response } from 'express';
import { SplitwiseService } from '../services/SplitwiseService';
import { SplitType } from '../models/Group';
import { ExpenseCategory } from '../models/Expense';
import { SettlementMethod } from '../models/Settlement';

export class SplitwiseController {
    private splitwiseService: SplitwiseService;

    constructor(splitwiseService: SplitwiseService) {
        this.splitwiseService = splitwiseService;
    }

    // User Management
    registerUser = (req: Request, res: Response): void => {
        try {
            const { name, email, password, phone } = req.body;
            
            if (!name || !email || !password) {
                res.status(400).json({ error: 'Name, email, and password are required' });
                return;
            }

            const user = this.splitwiseService.registerUser(name, email, password, phone);
            
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

            const user = this.splitwiseService.login(email, password);
            
            // Don't return the password in the response
            const { password: _, ...userWithoutPassword } = user;
            
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };

    logout = (req: Request, res: Response): void => {
        this.splitwiseService.logout();
        res.status(200).json({ message: 'Logged out successfully' });
    };

    getCurrentUser = (req: Request, res: Response): void => {
        const user = this.splitwiseService.getCurrentUser();
        
        if (!user) {
            res.status(401).json({ error: 'Not logged in' });
            return;
        }
        
        // Don't return the password in the response
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json(userWithoutPassword);
    };

    getUserById = (req: Request, res: Response): void => {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const user = this.splitwiseService.getUserById(userId);
            
            // Don't return the password in the response
            const { password: _, ...userWithoutPassword } = user;
            
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    getAllUsers = (req: Request, res: Response): void => {
        try {
            const users = this.splitwiseService.getAllUsers();
            
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

    // Friend Management
    addFriend = (req: Request, res: Response): void => {
        try {
            const { friendEmail } = req.body;
            
            if (!friendEmail) {
                res.status(400).json({ error: 'Friend email is required' });
                return;
            }

            this.splitwiseService.addFriend(friendEmail);
            res.status(200).json({ message: 'Friend added successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    removeFriend = (req: Request, res: Response): void => {
        try {
            const { friendId } = req.params;
            
            if (!friendId) {
                res.status(400).json({ error: 'Friend ID is required' });
                return;
            }

            this.splitwiseService.removeFriend(friendId);
            res.status(200).json({ message: 'Friend removed successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getFriends = (req: Request, res: Response): void => {
        try {
            const friends = this.splitwiseService.getFriends();
            
            // Don't return passwords in the response
            const friendsWithoutPasswords = friends.map(friend => {
                const { password: _, ...friendWithoutPassword } = friend;
                return friendWithoutPassword;
            });
            
            res.status(200).json(friendsWithoutPasswords);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // Group Management
    createGroup = (req: Request, res: Response): void => {
        try {
            const { name, description } = req.body;
            
            if (!name) {
                res.status(400).json({ error: 'Group name is required' });
                return;
            }

            const group = this.splitwiseService.createGroup(name, description);
            res.status(201).json(group);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getGroup = (req: Request, res: Response): void => {
        try {
            const { groupId } = req.params;
            
            if (!groupId) {
                res.status(400).json({ error: 'Group ID is required' });
                return;
            }

            const group = this.splitwiseService.getGroup(groupId);
            res.status(200).json(group);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    getAllGroups = (req: Request, res: Response): void => {
        try {
            const groups = this.splitwiseService.getAllGroups();
            res.status(200).json(groups);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getUserGroups = (req: Request, res: Response): void => {
        try {
            const groups = this.splitwiseService.getUserGroups();
            res.status(200).json(groups);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    addUserToGroup = (req: Request, res: Response): void => {
        try {
            const { groupId } = req.params;
            const { userEmail } = req.body;
            
            if (!groupId || !userEmail) {
                res.status(400).json({ error: 'Group ID and user email are required' });
                return;
            }

            this.splitwiseService.addUserToGroup(groupId, userEmail);
            res.status(200).json({ message: 'User added to group successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    removeUserFromGroup = (req: Request, res: Response): void => {
        try {
            const { groupId, userId } = req.params;
            
            if (!groupId || !userId) {
                res.status(400).json({ error: 'Group ID and user ID are required' });
                return;
            }

            this.splitwiseService.removeUserFromGroup(groupId, userId);
            res.status(200).json({ message: 'User removed from group successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    leaveGroup = (req: Request, res: Response): void => {
        try {
            const { groupId } = req.params;
            
            if (!groupId) {
                res.status(400).json({ error: 'Group ID is required' });
                return;
            }

            this.splitwiseService.leaveGroup(groupId);
            res.status(200).json({ message: 'Left group successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    deleteGroup = (req: Request, res: Response): void => {
        try {
            const { groupId } = req.params;
            
            if (!groupId) {
                res.status(400).json({ error: 'Group ID is required' });
                return;
            }

            this.splitwiseService.deleteGroup(groupId);
            res.status(200).json({ message: 'Group deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // Expense Management
    createExpense = (req: Request, res: Response): void => {
        try {
            const { 
                description, 
                amount, 
                paidBy, 
                participants, 
                splitType, 
                category, 
                groupId, 
                notes, 
                receiptUrl 
            } = req.body;
            
            if (!description || !amount || !paidBy || !participants) {
                res.status(400).json({ error: 'Description, amount, paidBy, and participants are required' });
                return;
            }

            const expense = this.splitwiseService.createExpense(
                description,
                parseFloat(amount),
                paidBy,
                participants,
                splitType as SplitType,
                category as ExpenseCategory,
                groupId,
                notes,
                receiptUrl
            );
            
            res.status(201).json(expense);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getExpense = (req: Request, res: Response): void => {
        try {
            const { expenseId } = req.params;
            
            if (!expenseId) {
                res.status(400).json({ error: 'Expense ID is required' });
                return;
            }

            const expense = this.splitwiseService.getExpense(expenseId);
            res.status(200).json(expense);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    getAllExpenses = (req: Request, res: Response): void => {
        try {
            const expenses = this.splitwiseService.getAllExpenses();
            res.status(200).json(expenses);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getUserExpenses = (req: Request, res: Response): void => {
        try {
            const expenses = this.splitwiseService.getUserExpenses();
            res.status(200).json(expenses);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getGroupExpenses = (req: Request, res: Response): void => {
        try {
            const { groupId } = req.params;
            
            if (!groupId) {
                res.status(400).json({ error: 'Group ID is required' });
                return;
            }

            const expenses = this.splitwiseService.getGroupExpenses(groupId);
            res.status(200).json(expenses);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    deleteExpense = (req: Request, res: Response): void => {
        try {
            const { expenseId } = req.params;
            
            if (!expenseId) {
                res.status(400).json({ error: 'Expense ID is required' });
                return;
            }

            this.splitwiseService.deleteExpense(expenseId);
            res.status(200).json({ message: 'Expense deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // Settlement Management
    createSettlement = (req: Request, res: Response): void => {
        try {
            const { fromUserId, toUserId, amount, method, notes } = req.body;
            
            if (!fromUserId || !toUserId || !amount) {
                res.status(400).json({ error: 'From user ID, to user ID, and amount are required' });
                return;
            }

            const settlement = this.splitwiseService.createSettlement(
                fromUserId,
                toUserId,
                parseFloat(amount),
                method as SettlementMethod,
                notes
            );
            
            res.status(201).json(settlement);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    completeSettlement = (req: Request, res: Response): void => {
        try {
            const { settlementId } = req.params;
            const { method } = req.body;
            
            if (!settlementId) {
                res.status(400).json({ error: 'Settlement ID is required' });
                return;
            }

            this.splitwiseService.completeSettlement(settlementId, method as SettlementMethod);
            res.status(200).json({ message: 'Settlement completed successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    cancelSettlement = (req: Request, res: Response): void => {
        try {
            const { settlementId } = req.params;
            
            if (!settlementId) {
                res.status(400).json({ error: 'Settlement ID is required' });
                return;
            }

            this.splitwiseService.cancelSettlement(settlementId);
            res.status(200).json({ message: 'Settlement cancelled successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getSettlement = (req: Request, res: Response): void => {
        try {
            const { settlementId } = req.params;
            
            if (!settlementId) {
                res.status(400).json({ error: 'Settlement ID is required' });
                return;
            }

            const settlement = this.splitwiseService.getSettlement(settlementId);
            res.status(200).json(settlement);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    getAllSettlements = (req: Request, res: Response): void => {
        try {
            const settlements = this.splitwiseService.getAllSettlements();
            res.status(200).json(settlements);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getUserSettlements = (req: Request, res: Response): void => {
        try {
            const settlements = this.splitwiseService.getUserSettlements();
            res.status(200).json(settlements);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // Balance Management
    getUserBalances = (req: Request, res: Response): void => {
        try {
            const balances = this.splitwiseService.getUserBalances();
            
            // Don't return passwords in the response
            const balancesWithoutPasswords = balances.map(balance => {
                const { user, balance: amount } = balance;
                const { password: _, ...userWithoutPassword } = user;
                return { user: userWithoutPassword, balance: amount };
            });
            
            res.status(200).json(balancesWithoutPasswords);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getTotalBalance = (req: Request, res: Response): void => {
        try {
            const totalBalance = this.splitwiseService.getTotalBalance();
            res.status(200).json({ totalBalance });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // Simplify Debts
    simplifyDebts = (req: Request, res: Response): void => {
        try {
            const debts = this.splitwiseService.simplifyDebts();
            
            // Don't return passwords in the response
            const debtsWithoutPasswords = debts.map(debt => {
                const { from, to, amount } = debt;
                const { password: _, ...fromWithoutPassword } = from;
                const { password: __, ...toWithoutPassword } = to;
                return { from: fromWithoutPassword, to: toWithoutPassword, amount };
            });
            
            res.status(200).json(debtsWithoutPasswords);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
} 