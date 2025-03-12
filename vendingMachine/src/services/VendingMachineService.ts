import { VendingMachine, VendingMachineState } from '../models/VendingMachine';
import { Product } from '../models/Product';
import { Coin, CoinType } from '../models/Coin';

export class VendingMachineService {
    private vendingMachine: VendingMachine;
    
    constructor() {
        this.vendingMachine = new VendingMachine();
        this.initializeProducts();
    }
    
    /**
     * Initialize the vending machine with some products
     */
    private initializeProducts(): void {
        const products = [
            new Product('A1', 'Coca Cola', 125, 10),
            new Product('A2', 'Pepsi', 125, 10),
            new Product('A3', 'Sprite', 125, 10),
            new Product('B1', 'Lays Chips', 150, 10),
            new Product('B2', 'Doritos', 150, 10),
            new Product('B3', 'Cheetos', 150, 10),
            new Product('C1', 'Snickers', 100, 10),
            new Product('C2', 'KitKat', 100, 10),
            new Product('C3', 'M&Ms', 100, 10)
        ];
        
        for (const product of products) {
            this.vendingMachine.addProduct(product);
        }
    }
    
    /**
     * Get all products in the vending machine
     */
    getAllProducts(): Product[] {
        return this.vendingMachine.getProducts();
    }
    
    /**
     * Get a product by ID
     * @param productId Product ID
     */
    getProduct(productId: string): Product | undefined {
        return this.vendingMachine.getProduct(productId);
    }
    
    /**
     * Select a product
     * @param productId Product ID
     */
    selectProduct(productId: string): void {
        try {
            this.vendingMachine.selectProduct(productId);
        } catch (error: any) {
            throw new Error(`Failed to select product: ${error.message}`);
        }
    }
    
    /**
     * Insert a coin
     * @param coinType Coin type
     */
    insertCoin(coinType: CoinType): void {
        try {
            const coin = new Coin(coinType);
            this.vendingMachine.insertCoin(coin);
        } catch (error: any) {
            throw new Error(`Failed to insert coin: ${error.message}`);
        }
    }
    
    /**
     * Dispense the selected product
     */
    dispenseProduct(): Product {
        try {
            return this.vendingMachine.dispenseProduct();
        } catch (error: any) {
            throw new Error(`Failed to dispense product: ${error.message}`);
        }
    }
    
    /**
     * Return change
     */
    returnChange(): { coins: Coin[], total: number } {
        try {
            const coins = this.vendingMachine.returnChange();
            const total = coins.reduce((sum, coin) => sum + coin.getValue(), 0);
            
            return { coins, total };
        } catch (error: any) {
            throw new Error(`Failed to return change: ${error.message}`);
        }
    }
    
    /**
     * Cancel the current transaction
     */
    cancelTransaction(): { coins: Coin[], total: number } {
        try {
            const coins = this.vendingMachine.cancelTransaction();
            const total = coins.reduce((sum, coin) => sum + coin.getValue(), 0);
            
            return { coins, total };
        } catch (error: any) {
            throw new Error(`Failed to cancel transaction: ${error.message}`);
        }
    }
    
    /**
     * Restock a product
     * @param productId Product ID
     * @param quantity Quantity to add
     */
    restockProduct(productId: string, quantity: number): void {
        try {
            this.vendingMachine.restockProduct(productId, quantity);
        } catch (error: any) {
            throw new Error(`Failed to restock product: ${error.message}`);
        }
    }
    
    /**
     * Restock coins
     * @param coinType Coin type
     * @param quantity Quantity to add
     */
    restockCoins(coinType: CoinType, quantity: number): void {
        try {
            this.vendingMachine.restockCoins(coinType, quantity);
        } catch (error: any) {
            throw new Error(`Failed to restock coins: ${error.message}`);
        }
    }
    
    /**
     * Get the current balance
     */
    getCurrentBalance(): number {
        return this.vendingMachine.getCurrentBalance();
    }
    
    /**
     * Get the current state
     */
    getCurrentState(): VendingMachineState {
        return this.vendingMachine.getCurrentState();
    }
    
    /**
     * Get the selected product ID
     */
    getSelectedProductId(): string | null {
        return this.vendingMachine.getSelectedProductId();
    }
    
    /**
     * Get the coin inventory
     */
    getCoinInventory(): Map<CoinType, number> {
        return this.vendingMachine.getCoinInventory();
    }
    
    /**
     * Get the coin inventory as an array
     */
    getCoinInventoryArray(): { type: CoinType, name: string, count: number }[] {
        const inventory = this.vendingMachine.getCoinInventory();
        const result: { type: CoinType, name: string, count: number }[] = [];
        
        for (const [type, count] of inventory.entries()) {
            const coin = new Coin(type);
            result.push({
                type,
                name: coin.getName(),
                count
            });
        }
        
        return result;
    }
} 