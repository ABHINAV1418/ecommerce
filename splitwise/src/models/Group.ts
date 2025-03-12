export enum SplitType {
    EQUAL = 'EQUAL',
    EXACT = 'EXACT',
    PERCENTAGE = 'PERCENTAGE',
    SHARES = 'SHARES'
}

export class Group {
    id: string;
    name: string;
    description?: string;
    members: Set<string>; // Set of user IDs
    expenses: Set<string>; // Set of expense IDs
    createdBy: string; // User ID
    createdAt: Date;
    defaultSplitType: SplitType;

    constructor(id: string, name: string, createdBy: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.members = new Set<string>();
        this.expenses = new Set<string>();
        this.createdBy = createdBy;
        this.createdAt = new Date();
        this.defaultSplitType = SplitType.EQUAL;
        
        // Add creator as a member
        this.members.add(createdBy);
    }

    addMember(userId: string): void {
        this.members.add(userId);
    }

    removeMember(userId: string): void {
        this.members.delete(userId);
    }

    addExpense(expenseId: string): void {
        this.expenses.add(expenseId);
    }

    removeExpense(expenseId: string): void {
        this.expenses.delete(expenseId);
    }

    getMembers(): string[] {
        return Array.from(this.members);
    }

    getMemberCount(): number {
        return this.members.size;
    }

    getExpenses(): string[] {
        return Array.from(this.expenses);
    }

    setDefaultSplitType(splitType: SplitType): void {
        this.defaultSplitType = splitType;
    }
} 