export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    CASH = 'CASH',
    WALLET = 'WALLET'
}

export class Payment {
    id: string;
    tripId: string;
    riderId: string;
    driverId: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    timestamp: Date;
    transactionId?: string;

    constructor(
        id: string,
        tripId: string,
        riderId: string,
        driverId: string,
        amount: number,
        method: PaymentMethod = PaymentMethod.CREDIT_CARD
    ) {
        this.id = id;
        this.tripId = tripId;
        this.riderId = riderId;
        this.driverId = driverId;
        this.amount = amount;
        this.status = PaymentStatus.PENDING;
        this.method = method;
        this.timestamp = new Date();
    }

    completePayment(transactionId: string): void {
        this.status = PaymentStatus.COMPLETED;
        this.transactionId = transactionId;
    }

    failPayment(): void {
        this.status = PaymentStatus.FAILED;
    }

    refundPayment(): void {
        this.status = PaymentStatus.REFUNDED;
    }
} 