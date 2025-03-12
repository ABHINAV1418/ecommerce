import { v4 as uuidv4 } from 'uuid';
import { Address } from './User';
import { CartItem } from './Cart';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    NET_BANKING = 'NET_BANKING',
    UPI = 'UPI',
    WALLET = 'WALLET',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export class OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    
    constructor(productId: string, quantity: number, price: number, productName: string = '') {
        this.id = uuidv4();
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }
    
    getTotalPrice(): number {
        return this.price * this.quantity;
    }
}

export class Payment {
    id: string;
    orderId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    timestamp: Date;
    
    constructor(orderId: string, amount: number, method: PaymentMethod) {
        this.id = uuidv4();
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
        this.status = PaymentStatus.PENDING;
        this.timestamp = new Date();
    }
    
    complete(transactionId: string): void {
        this.status = PaymentStatus.COMPLETED;
        this.transactionId = transactionId;
    }
    
    fail(): void {
        this.status = PaymentStatus.FAILED;
    }
    
    refund(): void {
        this.status = PaymentStatus.REFUNDED;
    }
}

export class Order {
    id: string;
    userId: string;
    items: OrderItem[];
    shippingAddress: Address;
    status: OrderStatus;
    payment?: Payment;
    createdAt: Date;
    updatedAt: Date;
    
    constructor(userId: string, cartItems: CartItem[], shippingAddress: Address) {
        this.id = uuidv4();
        this.userId = userId;
        this.items = cartItems.map(item => 
            new OrderItem(item.productId, item.quantity, item.price)
        );
        this.shippingAddress = shippingAddress;
        this.status = OrderStatus.PENDING;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }
    
    updateStatus(status: OrderStatus): void {
        this.status = status;
        this.updatedAt = new Date();
    }
    
    createPayment(method: PaymentMethod): Payment {
        const amount = this.getTotalPrice();
        this.payment = new Payment(this.id, amount, method);
        return this.payment;
    }
    
    isPaid(): boolean {
        return this.payment?.status === PaymentStatus.COMPLETED;
    }
} 