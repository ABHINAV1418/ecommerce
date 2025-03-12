import { OrderItem } from './OrderItem';

export enum OrderStatus {
    CREATED = 'CREATED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

export class Order {
    id: string;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: Date;
    confirmedAt?: Date;
    
    constructor(id: string, items: OrderItem[]) {
        this.id = id;
        this.items = items;
        this.status = OrderStatus.CREATED;
        this.createdAt = new Date();
    }
    
    /**
     * Confirm the order
     */
    confirm(): void {
        if (this.status === OrderStatus.CONFIRMED) {
            throw new Error('Order is already confirmed');
        }
        
        if (this.status === OrderStatus.CANCELLED) {
            throw new Error('Cannot confirm a cancelled order');
        }
        
        this.status = OrderStatus.CONFIRMED;
        this.confirmedAt = new Date();
    }
    
    /**
     * Cancel the order
     */
    cancel(): void {
        if (this.status === OrderStatus.CANCELLED) {
            throw new Error('Order is already cancelled');
        }
        
        if (this.status === OrderStatus.CONFIRMED) {
            throw new Error('Cannot cancel a confirmed order');
        }
        
        this.status = OrderStatus.CANCELLED;
    }
    
    /**
     * Check if the order is confirmed
     */
    isConfirmed(): boolean {
        return this.status === OrderStatus.CONFIRMED;
    }
    
    /**
     * Check if the order is cancelled
     */
    isCancelled(): boolean {
        return this.status === OrderStatus.CANCELLED;
    }
} 