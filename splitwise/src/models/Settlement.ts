export enum SettlementStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum SettlementMethod {
    CASH = 'CASH',
    BANK_TRANSFER = 'BANK_TRANSFER',
    UPI = 'UPI',
    PAYPAL = 'PAYPAL',
    OTHER = 'OTHER'
}

export class Settlement {
    id: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    status: SettlementStatus;
    method?: SettlementMethod;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;

    constructor(
        id: string,
        fromUserId: string,
        toUserId: string,
        amount: number,
        method?: SettlementMethod,
        notes?: string
    ) {
        this.id = id;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.amount = amount;
        this.status = SettlementStatus.PENDING;
        this.method = method;
        this.notes = notes;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    markAsCompleted(method: SettlementMethod = SettlementMethod.CASH): void {
        this.status = SettlementStatus.COMPLETED;
        this.method = method;
        this.completedAt = new Date();
        this.updatedAt = new Date();
    }

    markAsCancelled(): void {
        this.status = SettlementStatus.CANCELLED;
        this.updatedAt = new Date();
    }

    updateAmount(newAmount: number): void {
        if (this.status !== SettlementStatus.PENDING) {
            throw new Error('Cannot update amount of a non-pending settlement');
        }
        this.amount = newAmount;
        this.updatedAt = new Date();
    }

    updateMethod(method: SettlementMethod): void {
        this.method = method;
        this.updatedAt = new Date();
    }

    updateNotes(notes: string): void {
        this.notes = notes;
        this.updatedAt = new Date();
    }
} 