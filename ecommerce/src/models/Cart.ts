import { v4 as uuidv4 } from 'uuid';

export class CartItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    
    constructor(productId: string, quantity: number, price: number) {
        this.id = uuidv4();
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
    
    getTotalPrice(): number {
        return this.price * this.quantity;
    }
}

export class Cart {
    id: string;
    userId: string;
    items: CartItem[];
    
    constructor(userId: string) {
        this.id = uuidv4();
        this.userId = userId;
        this.items = [];
    }
    
    addItem(productId: string, quantity: number, price: number): CartItem {
        // Check if the item already exists in the cart
        const existingItem = this.items.find(item => item.productId === productId);
        
        if (existingItem) {
            // Update quantity if the item already exists
            existingItem.quantity += quantity;
            return existingItem;
        } else {
            // Add new item if it doesn't exist
            const newItem = new CartItem(productId, quantity, price);
            this.items.push(newItem);
            return newItem;
        }
    }
    
    updateItemQuantity(itemId: string, quantity: number): boolean {
        const item = this.items.find(item => item.id === itemId);
        
        if (item) {
            if (quantity <= 0) {
                // Remove the item if quantity is 0 or negative
                return this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                return true;
            }
        }
        
        return false;
    }
    
    removeItem(itemId: string): boolean {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== itemId);
        return initialLength > this.items.length;
    }
    
    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }
    
    getItemCount(): number {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    clear(): void {
        this.items = [];
    }
} 