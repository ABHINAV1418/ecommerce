import { Product } from './Product';
import { Coin, CoinType } from './Coin';

export enum VendingMachineState {
    IDLE = 'IDLE',
    ACCEPTING_COINS = 'ACCEPTING_COINS',
    DISPENSING_PRODUCT = 'DISPENSING_PRODUCT',
    RETURNING_CHANGE = 'RETURNING_CHANGE'
}

export class VendingMachine {
    private products: Map<string, Product>;
    private coinInventory: Map<CoinType, number>;
    private currentBalance: number;
    private state: VendingMachineState;
    private selectedProductId: string | null;
    
    constructor() {
        this.products = new Map<string, Product>();
        this.coinInventory = new Map<CoinType, number>();
        this.currentBalance = 0;
        this.state = VendingMachineState.IDLE;
        this.selectedProductId = null;
        
        // Initialize coin inventory
        this.coinInventory.set(CoinType.PENNY, 100);
        this.coinInventory.set(CoinType.NICKEL, 100);
        this.coinInventory.set(CoinType.DIME, 100);
        this.coinInventory.set(CoinType.QUARTER, 100);
    }
    
    /**
     * Add a product to the vending machine
     * @param product Product to add
     */
    addProduct(product: Product): void {
        this.products.set(product.id, product);
    }
    
    /**
     * Get all products in the vending machine
     */
    getProducts(): Product[] {
        return Array.from(this.products.values());
    }
    
    /**
     * Get a product by ID
     * @param productId Product ID
     */
    getProduct(productId: string): Product | undefined {
        return this.products.get(productId);
    }
    
    /**
     * Select a product
     * @param productId Product ID
     */
    selectProduct(productId: string): void {
        if (this.state !== VendingMachineState.IDLE) {
            throw new Error('Vending machine is not in IDLE state');
        }
        
        const product = this.products.get(productId);
        
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }
        
        if (!product.isAvailable()) {
            throw new Error(`Product ${product.name} is out of stock`);
        }
        
        this.selectedProductId = productId;
        this.state = VendingMachineState.ACCEPTING_COINS;
    }
    
    /**
     * Insert a coin
     * @param coin Coin to insert
     */
    insertCoin(coin: Coin): void {
        if (this.state !== VendingMachineState.ACCEPTING_COINS) {
            throw new Error('Vending machine is not accepting coins');
        }
        
        // Add coin to inventory
        const currentCount = this.coinInventory.get(coin.type) || 0;
        this.coinInventory.set(coin.type, currentCount + 1);
        
        // Add coin value to current balance
        this.currentBalance += coin.getValue();
        
        // Check if we have enough money to buy the selected product
        if (this.selectedProductId) {
            const product = this.products.get(this.selectedProductId)!;
            
            if (this.currentBalance >= product.price) {
                this.state = VendingMachineState.DISPENSING_PRODUCT;
            }
        }
    }
    
    /**
     * Dispense the selected product
     */
    dispenseProduct(): Product {
        if (this.state !== VendingMachineState.DISPENSING_PRODUCT) {
            throw new Error('Vending machine is not in DISPENSING_PRODUCT state');
        }
        
        if (!this.selectedProductId) {
            throw new Error('No product selected');
        }
        
        const product = this.products.get(this.selectedProductId)!;
        
        if (this.currentBalance < product.price) {
            throw new Error(`Insufficient funds. Required: ${product.price}, Current: ${this.currentBalance}`);
        }
        
        // Decrease product quantity
        product.decreaseQuantity();
        
        // Calculate change
        const change = this.currentBalance - product.price;
        
        // Reset current balance
        this.currentBalance = 0;
        
        // Set state to returning change if needed
        if (change > 0) {
            this.currentBalance = change;
            this.state = VendingMachineState.RETURNING_CHANGE;
        } else {
            this.state = VendingMachineState.IDLE;
            this.selectedProductId = null;
        }
        
        return product;
    }
    
    /**
     * Return change
     */
    returnChange(): Coin[] {
        if (this.state !== VendingMachineState.RETURNING_CHANGE && this.currentBalance === 0) {
            throw new Error('No change to return');
        }
        
        const change: Coin[] = [];
        let remainingAmount = this.currentBalance;
        
        // Try to return change using available coins
        // Start with the largest denomination
        const coinTypes = [CoinType.QUARTER, CoinType.DIME, CoinType.NICKEL, CoinType.PENNY];
        
        for (const coinType of coinTypes) {
            while (remainingAmount >= coinType && (this.coinInventory.get(coinType) || 0) > 0) {
                change.push(new Coin(coinType));
                remainingAmount -= coinType;
                
                // Decrease coin inventory
                const currentCount = this.coinInventory.get(coinType) || 0;
                this.coinInventory.set(coinType, currentCount - 1);
            }
        }
        
        // Reset current balance and state
        this.currentBalance = 0;
        this.state = VendingMachineState.IDLE;
        this.selectedProductId = null;
        
        return change;
    }
    
    /**
     * Cancel the current transaction
     */
    cancelTransaction(): Coin[] {
        if (this.state === VendingMachineState.IDLE && this.currentBalance === 0) {
            throw new Error('No transaction to cancel');
        }
        
        // Set state to returning change if there's a balance
        if (this.currentBalance > 0) {
            this.state = VendingMachineState.RETURNING_CHANGE;
            return this.returnChange();
        }
        
        // Reset state
        this.state = VendingMachineState.IDLE;
        this.selectedProductId = null;
        
        return [];
    }
    
    /**
     * Restock a product
     * @param productId Product ID
     * @param quantity Quantity to add
     */
    restockProduct(productId: string, quantity: number): void {
        const product = this.products.get(productId);
        
        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }
        
        product.restock(quantity);
    }
    
    /**
     * Restock coins
     * @param coinType Coin type
     * @param quantity Quantity to add
     */
    restockCoins(coinType: CoinType, quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Restock quantity must be positive');
        }
        
        const currentCount = this.coinInventory.get(coinType) || 0;
        this.coinInventory.set(coinType, currentCount + quantity);
    }
    
    /**
     * Get the current balance
     */
    getCurrentBalance(): number {
        return this.currentBalance;
    }
    
    /**
     * Get the current state
     */
    getCurrentState(): VendingMachineState {
        return this.state;
    }
    
    /**
     * Get the selected product ID
     */
    getSelectedProductId(): string | null {
        return this.selectedProductId;
    }
    
    /**
     * Get the coin inventory
     */
    getCoinInventory(): Map<CoinType, number> {
        return new Map(this.coinInventory);
    }
} 