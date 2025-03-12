import { User } from './User';
import { Group, SplitType } from './Group';
import { Expense, ExpenseCategory, ExpenseStatus, Split } from './Expense';
import { Settlement, SettlementMethod, SettlementStatus } from './Settlement';
import { v4 as uuidv4 } from 'uuid';

export class SplitwiseSystem {
    private users: Map<string, User>;
    private groups: Map<string, Group>;
    private expenses: Map<string, Expense>;
    private settlements: Map<string, Settlement>;
    private currentUser: User | null;

    constructor() {
        this.users = new Map<string, User>();
        this.groups = new Map<string, Group>();
        this.expenses = new Map<string, Expense>();
        this.settlements = new Map<string, Settlement>();
        this.currentUser = null;

        // Create a default admin user
        const adminId = uuidv4();
        const adminUser = new User(
            adminId,
            'Admin',
            'admin@example.com',
            'admin123' // In a real system, this would be hashed
        );
        this.users.set(adminId, adminUser);
    }

    // User Management
    registerUser(name: string, email: string, password: string, phone?: string): User {
        // Check if email already exists
        const existingUser = Array.from(this.users.values()).find(user => user.email === email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const userId = uuidv4();
        const newUser = new User(userId, name, email, password, phone);
        this.users.set(userId, newUser);
        return newUser;
    }

    login(email: string, password: string): User {
        const user = Array.from(this.users.values()).find(
            user => user.email === email && user.password === password
        );

        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = user;
        return user;
    }

    logout(): void {
        this.currentUser = null;
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    getUserById(userId: string): User {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    // Friend Management
    addFriend(friendEmail: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to add a friend');
        }

        const friend = Array.from(this.users.values()).find(user => user.email === friendEmail);
        if (!friend) {
            throw new Error('User not found with the provided email');
        }

        if (friend.id === this.currentUser.id) {
            throw new Error('You cannot add yourself as a friend');
        }

        this.currentUser.addFriend(friend.id);
        friend.addFriend(this.currentUser.id);
    }

    removeFriend(friendId: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to remove a friend');
        }

        const friend = this.users.get(friendId);
        if (!friend) {
            throw new Error('Friend not found');
        }

        this.currentUser.removeFriend(friendId);
        friend.removeFriend(this.currentUser.id);
    }

    getFriends(): User[] {
        if (!this.currentUser) {
            throw new Error('You must be logged in to get friends');
        }

        return Array.from(this.currentUser.friends).map(friendId => {
            const friend = this.users.get(friendId);
            if (!friend) {
                throw new Error(`Friend with ID ${friendId} not found`);
            }
            return friend;
        });
    }

    // Group Management
    createGroup(name: string, description?: string): Group {
        if (!this.currentUser) {
            throw new Error('You must be logged in to create a group');
        }

        const groupId = uuidv4();
        const newGroup = new Group(groupId, name, this.currentUser.id, description);
        this.groups.set(groupId, newGroup);
        
        // Add the group to the current user's groups
        this.currentUser.addGroup(groupId);

        return newGroup;
    }

    getGroup(groupId: string): Group {
        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        return group;
    }

    getAllGroups(): Group[] {
        return Array.from(this.groups.values());
    }

    getUserGroups(): Group[] {
        if (!this.currentUser) {
            throw new Error('You must be logged in to get your groups');
        }

        return Array.from(this.currentUser.groups).map(groupId => {
            const group = this.groups.get(groupId);
            if (!group) {
                throw new Error(`Group with ID ${groupId} not found`);
            }
            return group;
        });
    }

    addUserToGroup(groupId: string, userEmail: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to add a user to a group');
        }

        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if current user is a member of the group
        if (!group.members.has(this.currentUser.id)) {
            throw new Error('You must be a member of the group to add users');
        }

        const user = Array.from(this.users.values()).find(user => user.email === userEmail);
        if (!user) {
            throw new Error('User not found with the provided email');
        }

        group.addMember(user.id);
        user.addGroup(groupId);
    }

    removeUserFromGroup(groupId: string, userId: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to remove a user from a group');
        }

        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if current user is the creator of the group
        if (group.createdBy !== this.currentUser.id) {
            throw new Error('Only the group creator can remove users');
        }

        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        group.removeMember(userId);
        user.removeGroup(groupId);
    }

    leaveGroup(groupId: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to leave a group');
        }

        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if current user is a member of the group
        if (!group.members.has(this.currentUser.id)) {
            throw new Error('You are not a member of this group');
        }

        // Check if current user is the creator of the group
        if (group.createdBy === this.currentUser.id) {
            throw new Error('Group creator cannot leave the group. You can delete the group instead.');
        }

        group.removeMember(this.currentUser.id);
        this.currentUser.removeGroup(groupId);
    }

    deleteGroup(groupId: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to delete a group');
        }

        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if current user is the creator of the group
        if (group.createdBy !== this.currentUser.id) {
            throw new Error('Only the group creator can delete the group');
        }

        // Remove the group from all members' groups
        group.getMembers().forEach(memberId => {
            const member = this.users.get(memberId);
            if (member) {
                member.removeGroup(groupId);
            }
        });

        // Delete all expenses associated with the group
        group.getExpenses().forEach(expenseId => {
            this.expenses.delete(expenseId);
        });

        // Delete the group
        this.groups.delete(groupId);
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
        if (!this.currentUser) {
            throw new Error('You must be logged in to create an expense');
        }

        // Validate paidBy user exists
        const payer = this.users.get(paidBy);
        if (!payer) {
            throw new Error('Payer not found');
        }

        // Validate all participants exist
        for (const participantId of participants) {
            if (!this.users.has(participantId)) {
                throw new Error(`Participant with ID ${participantId} not found`);
            }
        }

        // If groupId is provided, validate it exists and all participants are members
        if (groupId) {
            const group = this.groups.get(groupId);
            if (!group) {
                throw new Error('Group not found');
            }

            // Check if current user is a member of the group
            if (!group.members.has(this.currentUser.id)) {
                throw new Error('You must be a member of the group to create an expense');
            }

            // Check if all participants are members of the group
            for (const participantId of participants) {
                if (!group.members.has(participantId)) {
                    throw new Error(`Participant with ID ${participantId} is not a member of the group`);
                }
            }
        }

        const expenseId = uuidv4();
        const newExpense = new Expense(
            expenseId,
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

        // Calculate splits
        newExpense.calculateSplits();

        // Update balances for all participants
        newExpense.splits.forEach((amount, userId) => {
            const user = this.users.get(userId);
            if (user) {
                // For each participant, update their balance with every other participant
                newExpense.splits.forEach((otherAmount, otherUserId) => {
                    if (userId !== otherUserId) {
                        // If this user paid (positive amount) and other user owes (negative amount)
                        if (amount > 0 && otherAmount < 0) {
                            // Update this user's balance with the other user
                            user.updateBalance(otherUserId, -otherAmount);
                        }
                    }
                });
            }
        });

        // Add expense to the system
        this.expenses.set(expenseId, newExpense);

        // If expense is part of a group, add it to the group
        if (groupId) {
            const group = this.groups.get(groupId);
            if (group) {
                group.addExpense(expenseId);
            }
        }

        return newExpense;
    }

    getExpense(expenseId: string): Expense {
        const expense = this.expenses.get(expenseId);
        if (!expense) {
            throw new Error('Expense not found');
        }
        return expense;
    }

    getAllExpenses(): Expense[] {
        return Array.from(this.expenses.values());
    }

    getUserExpenses(): Expense[] {
        if (!this.currentUser) {
            throw new Error('You must be logged in to get your expenses');
        }

        return Array.from(this.expenses.values()).filter(expense => 
            expense.participants.has(this.currentUser!.id)
        );
    }

    getGroupExpenses(groupId: string): Expense[] {
        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        return group.getExpenses().map(expenseId => {
            const expense = this.expenses.get(expenseId);
            if (!expense) {
                throw new Error(`Expense with ID ${expenseId} not found`);
            }
            return expense;
        });
    }

    deleteExpense(expenseId: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to delete an expense');
        }

        const expense = this.expenses.get(expenseId);
        if (!expense) {
            throw new Error('Expense not found');
        }

        // Check if current user is the payer or a participant
        if (expense.paidBy !== this.currentUser.id && !expense.participants.has(this.currentUser.id)) {
            throw new Error('You must be the payer or a participant to delete an expense');
        }

        // Reverse the balances for all participants
        expense.splits.forEach((amount, userId) => {
            const user = this.users.get(userId);
            if (user) {
                // For each participant, update their balance with every other participant
                expense.splits.forEach((otherAmount, otherUserId) => {
                    if (userId !== otherUserId) {
                        // If this user paid (positive amount) and other user owes (negative amount)
                        if (amount > 0 && otherAmount < 0) {
                            // Reverse the balance update
                            user.updateBalance(otherUserId, otherAmount);
                        }
                    }
                });
            }
        });

        // If expense is part of a group, remove it from the group
        if (expense.groupId) {
            const group = this.groups.get(expense.groupId);
            if (group) {
                group.removeExpense(expenseId);
            }
        }

        // Mark expense as deleted
        expense.markAsDeleted();
    }

    // Settlement Management
    createSettlement(fromUserId: string, toUserId: string, amount: number, method?: SettlementMethod, notes?: string): Settlement {
        if (!this.currentUser) {
            throw new Error('You must be logged in to create a settlement');
        }

        // Validate users exist
        const fromUser = this.users.get(fromUserId);
        const toUser = this.users.get(toUserId);
        if (!fromUser || !toUser) {
            throw new Error('One or both users not found');
        }

        // Check if current user is involved in the settlement
        if (this.currentUser.id !== fromUserId && this.currentUser.id !== toUserId) {
            throw new Error('You must be involved in the settlement');
        }

        // Check if there is a debt between the users
        const debt = fromUser.getBalanceWithUser(toUserId);
        if (debt >= 0) {
            throw new Error(`${fromUser.name} does not owe money to ${toUser.name}`);
        }

        // Check if the settlement amount is valid
        if (amount <= 0 || amount > Math.abs(debt)) {
            throw new Error(`Settlement amount must be positive and not exceed the debt of ${Math.abs(debt)}`);
        }

        const settlementId = uuidv4();
        const newSettlement = new Settlement(
            settlementId,
            fromUserId,
            toUserId,
            amount,
            method,
            notes
        );

        this.settlements.set(settlementId, newSettlement);
        return newSettlement;
    }

    completeSettlement(settlementId: string, method: SettlementMethod = SettlementMethod.CASH): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to complete a settlement');
        }

        const settlement = this.settlements.get(settlementId);
        if (!settlement) {
            throw new Error('Settlement not found');
        }

        // Check if current user is involved in the settlement
        if (this.currentUser.id !== settlement.fromUserId && this.currentUser.id !== settlement.toUserId) {
            throw new Error('You must be involved in the settlement');
        }

        // Check if settlement is already completed or cancelled
        if (settlement.status !== SettlementStatus.PENDING) {
            throw new Error('Settlement is not pending');
        }

        // Update balances
        const fromUser = this.users.get(settlement.fromUserId);
        const toUser = this.users.get(settlement.toUserId);
        if (!fromUser || !toUser) {
            throw new Error('One or both users not found');
        }

        fromUser.updateBalance(settlement.toUserId, settlement.amount);
        toUser.updateBalance(settlement.fromUserId, -settlement.amount);

        // Mark settlement as completed
        settlement.markAsCompleted(method);
    }

    cancelSettlement(settlementId: string): void {
        if (!this.currentUser) {
            throw new Error('You must be logged in to cancel a settlement');
        }

        const settlement = this.settlements.get(settlementId);
        if (!settlement) {
            throw new Error('Settlement not found');
        }

        // Check if current user is involved in the settlement
        if (this.currentUser.id !== settlement.fromUserId && this.currentUser.id !== settlement.toUserId) {
            throw new Error('You must be involved in the settlement');
        }

        // Check if settlement is already completed or cancelled
        if (settlement.status !== SettlementStatus.PENDING) {
            throw new Error('Settlement is not pending');
        }

        // Mark settlement as cancelled
        settlement.markAsCancelled();
    }

    getSettlement(settlementId: string): Settlement {
        const settlement = this.settlements.get(settlementId);
        if (!settlement) {
            throw new Error('Settlement not found');
        }
        return settlement;
    }

    getAllSettlements(): Settlement[] {
        return Array.from(this.settlements.values());
    }

    getUserSettlements(): Settlement[] {
        if (!this.currentUser) {
            throw new Error('You must be logged in to get your settlements');
        }

        return Array.from(this.settlements.values()).filter(settlement => 
            settlement.fromUserId === this.currentUser!.id || settlement.toUserId === this.currentUser!.id
        );
    }

    // Balance Management
    getUserBalances(): { user: User, balance: number }[] {
        if (!this.currentUser) {
            throw new Error('You must be logged in to get your balances');
        }

        const balances: { user: User, balance: number }[] = [];
        this.currentUser.balance.forEach((balance, userId) => {
            const user = this.users.get(userId);
            if (user) {
                balances.push({ user, balance });
            }
        });

        return balances;
    }

    getTotalBalance(): number {
        if (!this.currentUser) {
            throw new Error('You must be logged in to get your total balance');
        }

        return this.currentUser.getTotalBalance();
    }

    // Simplify Debts
    simplifyDebts(): { from: User, to: User, amount: number }[] {
        // This is a complex algorithm to simplify debts
        // For now, we'll just return all the debts
        const debts: { from: User, to: User, amount: number }[] = [];
        
        this.users.forEach(user => {
            user.balance.forEach((balance, otherUserId) => {
                if (balance < 0) {
                    const otherUser = this.users.get(otherUserId);
                    if (otherUser) {
                        debts.push({
                            from: user,
                            to: otherUser,
                            amount: Math.abs(balance)
                        });
                    }
                }
            });
        });

        return debts;
    }
} 