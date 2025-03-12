import { v4 as uuidv4 } from 'uuid';

export enum ProductCategory {
    ELECTRONICS = 'ELECTRONICS',
    CLOTHING = 'CLOTHING',
    BOOKS = 'BOOKS',
    HOME = 'HOME',
    BEAUTY = 'BEAUTY',
    TOYS = 'TOYS',
    SPORTS = 'SPORTS',
    GROCERY = 'GROCERY',
    OTHER = 'OTHER'
}

export class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    inventory: number;
    images: string[];
    ratings: number[];
    serviceablePincodes: Set<string>;
    
    constructor(
        name: string,
        description: string,
        price: number,
        category: ProductCategory,
        inventory: number = 0
    ) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.inventory = inventory;
        this.images = [];
        this.ratings = [];
        this.serviceablePincodes = new Set<string>();
    }
    
    updateInventory(quantity: number): void {
        this.inventory = quantity;
    }
    
    addInventory(quantity: number): void {
        this.inventory += quantity;
    }
    
    removeInventory(quantity: number): boolean {
        if (this.inventory >= quantity) {
            this.inventory -= quantity;
            return true;
        }
        return false;
    }
    
    isInStock(): boolean {
        return this.inventory > 0;
    }
    
    addImage(imageUrl: string): void {
        this.images.push(imageUrl);
    }
    
    removeImage(imageUrl: string): void {
        this.images = this.images.filter(img => img !== imageUrl);
    }
    
    addRating(rating: number): void {
        if (rating >= 1 && rating <= 5) {
            this.ratings.push(rating);
        }
    }
    
    getAverageRating(): number {
        if (this.ratings.length === 0) {
            return 0;
        }
        const sum = this.ratings.reduce((a, b) => a + b, 0);
        return sum / this.ratings.length;
    }
    
    addServiceablePincode(pincode: string): void {
        this.serviceablePincodes.add(pincode);
    }
    
    removeServiceablePincode(pincode: string): void {
        this.serviceablePincodes.delete(pincode);
    }
    
    isServiceableAt(pincode: string): boolean {
        return this.serviceablePincodes.has(pincode);
    }
} 