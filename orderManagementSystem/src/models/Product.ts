export class Product {
    id: string;
    quantity: number;
    
    constructor(id: string, quantity: number) {
        this.id = id;
        this.quantity = quantity;
    }
    
    /**
     * Add quantity to the product
     * @param quantity Quantity to add
     */
    addQuantity(quantity: number): void {
        if (quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }
        this.quantity += quantity;
    }
    
    /**
     * Remove quantity from the product
     * @param quantity Quantity to remove
     */
    removeQuantity(quantity: number): void {
        if (quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }
        
        if (quantity > this.quantity) {
            throw new Error(`Insufficient stock. Available: ${this.quantity}, Requested: ${quantity}`);
        }
        
        this.quantity -= quantity;
    }
} 