import { SplitwiseSystem } from '../models/SplitwiseSystem';
import { User } from '../models/User';
import { Group, SplitType } from '../models/Group';
import { Expense, ExpenseCategory } from '../models/Expense';
import { Settlement, SettlementMethod } from '../models/Settlement';

export class SplitwiseService {
    private splitwiseSystem: SplitwiseSystem;

    constructor() {
        this.splitwiseSystem = new SplitwiseSystem();
    }

    // User Management
    registerUser(name: string, email: string, password: string, phone?: string): User {
        try {
            return this.splitwiseSystem.registerUser(name, email, password, phone);
        } catch (error) {
            throw error;
        }
    }

    login(email: string, password: string): User {
        try {
            return this.splitwiseSystem.login(email, password);
        } catch (error) {
            throw error;
        }
    }

    logout(): void {
        this.splitwiseSystem.logout();
    }

    getCurrentUser(): User | null {
        return this.splitwiseSystem.getCurrentUser();
    }

    getUserById(userId: string): User {
        try {
            return this.splitwiseSystem.getUserById(userId);
        } catch (error) {
            throw error;
        }
    }

    getAllUsers(): User[] {
        return this.splitwiseSystem.getAllUsers();
    }

    // Friend Management
    addFriend(friendEmail: string): void {
        try {
            this.splitwiseSystem.addFriend(friendEmail);
        } catch (error) {
            throw error;
        }
    }

    removeFriend(friendId: string): void {
        try {
            this.splitwiseSystem.removeFriend(friendId);
        } catch (error) {
            throw error;
        }
    }

    getFriends(): User[] {
        try {
            return this.splitwiseSystem.getFriends();
        } catch (error) {
            throw error;
        }
    }

    // Group Management
    createGroup(name: string, description?: string): Group {
        try {
            return this.splitwiseSystem.createGroup(name, description);
        } catch (error) {
            throw error;
        }
    }

    getGroup(groupId: string): Group {
        try {
            return this.splitwiseSystem.getGroup(groupId);
        } catch (error) {
            throw error;
        }
    }

    getAllGroups(): Group[] {
        return this.splitwiseSystem.getAllGroups();
    }

    getUserGroups(): Group[] {
        try {
            return this.splitwiseSystem.getUserGroups();
        } catch (error) {
            throw error;
        }
    }

    addUserToGroup(groupId: string, userEmail: string): void {
        try {
            this.splitwiseSystem.addUserToGroup(groupId, userEmail);
        } catch (error) {
            throw error;
        }
    }

    removeUserFromGroup(groupId: string, userId: string): void {
        try {
            this.splitwiseSystem.removeUserFromGroup(groupId, userId);
        } catch (error) {
            throw error;
        }
    }

    leaveGroup(groupId: string): void {
        try {
            this.splitwiseSystem.leaveGroup(groupId);
        } catch (error) {
            throw error;
        }
    }

    deleteGroup(groupId: string): void {
        try {
            this.splitwiseSystem.deleteGroup(groupId);
        } catch (error) {
            throw error;
        }
    }

    // Expense Management
    createExpense(
        description: string,
        amount: number,
        paidBy: string,
        participants: string[],
        splitType: SplitType = SplitType.EQUAL,
        category: ExpenseCategory = ExpenseCategory.OTHER,
        groupId?: string,
        notes?: string,
        receiptUrl?: string
    ): Expense {
        try {
            return this.splitwiseSystem.createExpense(
                description,
                amount,
                paidBy,
                participants,
                splitType,
                category,
                groupId,
                notes,
                receiptUrl
            );
        } catch (error) {
            throw error;
        }
    }

    getExpense(expenseId: string): Expense {
        try {
            return this.splitwiseSystem.getExpense(expenseId);
        } catch (error) {
            throw error;
        }
    }

    getAllExpenses(): Expense[] {
        return this.splitwiseSystem.getAllExpenses();
    }

    getUserExpenses(): Expense[] {
        try {
            return this.splitwiseSystem.getUserExpenses();
        } catch (error) {
            throw error;
        }
    }

    getGroupExpenses(groupId: string): Expense[] {
        try {
            return this.splitwiseSystem.getGroupExpenses(groupId);
        } catch (error) {
            throw error;
        }
    }

    deleteExpense(expenseId: string): void {
        try {
            this.splitwiseSystem.deleteExpense(expenseId);
        } catch (error) {
            throw error;
        }
    }

    // Settlement Management
    createSettlement(fromUserId: string, toUserId: string, amount: number, method?: SettlementMethod, notes?: string): Settlement {
        try {
            return this.splitwiseSystem.createSettlement(fromUserId, toUserId, amount, method, notes);
        } catch (error) {
            throw error;
        }
    }

    completeSettlement(settlementId: string, method: SettlementMethod): void {
        try {
            this.splitwiseSystem.completeSettlement(settlementId, method);
        } catch (error) {
            throw error;
        }
    }

    cancelSettlement(settlementId: string): void {
        try {
            this.splitwiseSystem.cancelSettlement(settlementId);
        } catch (error) {
            throw error;
        }
    }

    getSettlement(settlementId: string): Settlement {
        try {
            return this.splitwiseSystem.getSettlement(settlementId);
        } catch (error) {
            throw error;
        }
    }

    getAllSettlements(): Settlement[] {
        return this.splitwiseSystem.getAllSettlements();
    }

    getUserSettlements(): Settlement[] {
        try {
            return this.splitwiseSystem.getUserSettlements();
        } catch (error) {
            throw error;
        }
    }

    // Balance Management
    getUserBalances(): { user: User, balance: number }[] {
        try {
            return this.splitwiseSystem.getUserBalances();
        } catch (error) {
            throw error;
        }
    }

    getTotalBalance(): number {
        try {
            return this.splitwiseSystem.getTotalBalance();
        } catch (error) {
            throw error;
        }
    }

    // Simplify Debts
    simplifyDebts(): { from: User, to: User, amount: number }[] {
        return this.splitwiseSystem.simplifyDebts();
    }
} 