export class User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    password: string; // In a real system, this would be hashed
    friends: Set<string>; // Set of user IDs
    groups: Set<string>; // Set of group IDs
    balance: Map<string, number>; // Map of userID to balance amount (positive means owed to this user)

    constructor(id: string, name: string, email: string, password: string, phone?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.friends = new Set<string>();
        this.groups = new Set<string>();
        this.balance = new Map<string, number>();
    }

    addFriend(userId: string): void {
        this.friends.add(userId);
    }

    removeFriend(userId: string): void {
        this.friends.delete(userId);
    }

    addGroup(groupId: string): void {
        this.groups.add(groupId);
    }

    removeGroup(groupId: string): void {
        this.groups.delete(groupId);
    }

    updateBalance(userId: string, amount: number): void {
        const currentBalance = this.balance.get(userId) || 0;
        this.balance.set(userId, currentBalance + amount);
    }

    getBalanceWithUser(userId: string): number {
        return this.balance.get(userId) || 0;
    }

    getTotalBalance(): number {
        let total = 0;
        this.balance.forEach(amount => {
            total += amount;
        });
        return total;
    }

    getPositiveBalances(): Map<string, number> {
        const positiveBalances = new Map<string, number>();
        this.balance.forEach((amount, userId) => {
            if (amount > 0) {
                positiveBalances.set(userId, amount);
            }
        });
        return positiveBalances;
    }

    getNegativeBalances(): Map<string, number> {
        const negativeBalances = new Map<string, number>();
        this.balance.forEach((amount, userId) => {
            if (amount < 0) {
                negativeBalances.set(userId, amount);
            }
        });
        return negativeBalances;
    }
} 