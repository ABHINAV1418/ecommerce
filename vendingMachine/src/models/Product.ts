export class Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    
    constructor(id: string, name: string, price: number, quantity: number) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
    
    /**
     * Check if the product is available
     */
    isAvailable(): boolean {
        return this.quantity > 0;
    }
    
    /**
     * Decrease the quantity of the product
     */
    decreaseQuantity(): void {
        if (this.quantity <= 0) {
            throw new Error(`Product ${this.name} is out of stock`);
        }
        this.quantity--;
    }
    
    /**
     * Restock the product
     * @param quantity Quantity to add
     */
    restock(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Restock quantity must be positive');
        }
        this.quantity += quantity;
    }
} 