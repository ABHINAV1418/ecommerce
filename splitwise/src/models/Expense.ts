import { SplitType } from './Group';

export enum ExpenseCategory {
    FOOD = 'FOOD',
    RENT = 'RENT',
    UTILITIES = 'UTILITIES',
    ENTERTAINMENT = 'ENTERTAINMENT',
    TRAVEL = 'TRAVEL',
    SHOPPING = 'SHOPPING',
    MEDICAL = 'MEDICAL',
    EDUCATION = 'EDUCATION',
    OTHER = 'OTHER'
}

export enum ExpenseStatus {
    ACTIVE = 'ACTIVE',
    SETTLED = 'SETTLED',
    DELETED = 'DELETED'
}

export interface Split {
    userId: string;
    amount: number;
}

export class Expense {
    id: string;
    description: string;
    amount: number;
    paidBy: string; // User ID
    groupId?: string; // Optional, if expense is part of a group
    participants: Set<string>; // Set of user IDs
    splits: Map<string, number>; // Map of userID to amount
    category: ExpenseCategory;
    date: Date;
    notes?: string;
    status: ExpenseStatus;
    splitType: SplitType;
    createdAt: Date;
    updatedAt: Date;
    receiptUrl?: string;

    constructor(
        id: string,
        description: string,
        amount: number,
        paidBy: string,
        participants: string[],
        splitType: SplitType = SplitType.EQUAL,
        category: ExpenseCategory = ExpenseCategory.OTHER,
        groupId?: string,
        notes?: string,
        receiptUrl?: string
    ) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.paidBy = paidBy;
        this.groupId = groupId;
        this.participants = new Set<string>(participants);
        this.splits = new Map<string, number>();
        this.category = category;
        this.date = new Date();
        this.notes = notes;
        this.status = ExpenseStatus.ACTIVE;
        this.splitType = splitType;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.receiptUrl = receiptUrl;

        // Add payer as a participant if not already included
        this.participants.add(paidBy);
    }

    calculateSplits(): void {
        // Clear existing splits
        this.splits.clear();

        const participantCount = this.participants.size;
        const participants = Array.from(this.participants);

        switch (this.splitType) {
            case SplitType.EQUAL:
                const equalShare = this.amount / participantCount;
                participants.forEach(userId => {
                    if (userId === this.paidBy) {
                        // Payer gets credited for what others owe
                        this.splits.set(userId, this.amount - equalShare);
                    } else {
                        // Others owe their share (negative amount)
                        this.splits.set(userId, -equalShare);
                    }
                });
                break;
            
            // Other split types would be implemented here
            // For now, default to equal split
            default:
                this.calculateEqualSplits();
                break;
        }
    }

    private calculateEqualSplits(): void {
        const participantCount = this.participants.size;
        const equalShare = this.amount / participantCount;
        const participants = Array.from(this.participants);

        participants.forEach(userId => {
            if (userId === this.paidBy) {
                // Payer gets credited for what others owe
                this.splits.set(userId, this.amount - equalShare);
            } else {
                // Others owe their share (negative amount)
                this.splits.set(userId, -equalShare);
            }
        });
    }

    setExactSplits(splits: Split[]): void {
        // Validate that the sum of splits equals the total amount
        const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
        if (Math.abs(totalSplit - this.amount) > 0.01) { // Allow for small floating point errors
            throw new Error('Sum of splits must equal the total amount');
        }

        this.splitType = SplitType.EXACT;
        this.splits.clear();

        // Set the splits
        splits.forEach(split => {
            if (split.userId === this.paidBy) {
                // Payer gets credited for what others owe
                this.splits.set(split.userId, this.amount - split.amount);
            } else {
                // Others owe their share (negative amount)
                this.splits.set(split.userId, -split.amount);
            }
        });
    }

    setPercentageSplits(splits: Split[]): void {
        // Validate that the sum of percentages equals 100
        const totalPercentage = splits.reduce((sum, split) => sum + split.amount, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) { // Allow for small floating point errors
            throw new Error('Sum of percentages must equal 100');
        }

        this.splitType = SplitType.PERCENTAGE;
        this.splits.clear();

        // Calculate and set the splits
        splits.forEach(split => {
            const amount = (split.amount / 100) * this.amount;
            if (split.userId === this.paidBy) {
                // Payer gets credited for what others owe
                this.splits.set(split.userId, this.amount - amount);
            } else {
                // Others owe their share (negative amount)
                this.splits.set(split.userId, -amount);
            }
        });
    }

    setSharesSplits(splits: Split[]): void {
        // Calculate total shares
        const totalShares = splits.reduce((sum, split) => sum + split.amount, 0);
        
        this.splitType = SplitType.SHARES;
        this.splits.clear();

        // Calculate and set the splits
        splits.forEach(split => {
            const amount = (split.amount / totalShares) * this.amount;
            if (split.userId === this.paidBy) {
                // Payer gets credited for what others owe
                this.splits.set(split.userId, this.amount - amount);
            } else {
                // Others owe their share (negative amount)
                this.splits.set(split.userId, -amount);
            }
        });
    }

    getSplitForUser(userId: string): number {
        return this.splits.get(userId) || 0;
    }

    markAsSettled(): void {
        this.status = ExpenseStatus.SETTLED;
        this.updatedAt = new Date();
    }

    markAsDeleted(): void {
        this.status = ExpenseStatus.DELETED;
        this.updatedAt = new Date();
    }

    updateAmount(newAmount: number): void {
        this.amount = newAmount;
        this.updatedAt = new Date();
        this.calculateSplits();
    }

    updateDescription(newDescription: string): void {
        this.description = newDescription;
        this.updatedAt = new Date();
    }

    updateCategory(newCategory: ExpenseCategory): void {
        this.category = newCategory;
        this.updatedAt = new Date();
    }

    addParticipant(userId: string): void {
        this.participants.add(userId);
        this.updatedAt = new Date();
        this.calculateSplits();
    }

    removeParticipant(userId: string): void {
        if (userId === this.paidBy) {
            throw new Error('Cannot remove the payer from participants');
        }
        this.participants.delete(userId);
        this.updatedAt = new Date();
        this.calculateSplits();
    }
} 