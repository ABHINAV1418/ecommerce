import { VendingMachineService } from './services/VendingMachineService';
import { CoinType } from './models/Coin';
import { VendingMachineState } from './models/VendingMachine';

// Create a new instance of the VendingMachineService
const vendingMachineService = new VendingMachineService();

// Demo function to showcase the vending machine
function runDemo() {
    console.log('=== Vending Machine Demo ===');
    
    try {
        // 1. Display all products
        console.log('\n1. Available Products:');
        const products = vendingMachineService.getAllProducts();
        products.forEach(product => {
            console.log(`${product.id}: ${product.name} - ${product.price} cents (${product.quantity} available)`);
        });
        
        // 2. Select a product
        const productId = 'A1'; // Coca Cola
        console.log(`\n2. Selecting product ${productId}`);
        vendingMachineService.selectProduct(productId);
        console.log(`Current state: ${vendingMachineService.getCurrentState()}`);
        console.log(`Current balance: ${vendingMachineService.getCurrentBalance()} cents`);
        
        // 3. Insert coins
        console.log('\n3. Inserting coins');
        
        // Get the selected product
        const product = vendingMachineService.getProduct(productId)!;
        console.log(`Selected product: ${product.name} - ${product.price} cents`);
        
        // Insert coins until we have enough money
        const coinsToInsert = [
            { type: CoinType.QUARTER, name: 'Quarter' },
            { type: CoinType.QUARTER, name: 'Quarter' },
            { type: CoinType.QUARTER, name: 'Quarter' },
            { type: CoinType.QUARTER, name: 'Quarter' },
            { type: CoinType.QUARTER, name: 'Quarter' }
        ];
        
        for (const coin of coinsToInsert) {
            vendingMachineService.insertCoin(coin.type);
            console.log(`Inserted a ${coin.name}. Current balance: ${vendingMachineService.getCurrentBalance()} cents`);
            
            // Check if we have enough money
            if (vendingMachineService.getCurrentState() === VendingMachineState.DISPENSING_PRODUCT) {
                console.log(`We have enough money! State changed to: ${vendingMachineService.getCurrentState()}`);
                break;
            }
        }
        
        // 4. Dispense the product
        console.log('\n4. Dispensing the product');
        const dispensedProduct = vendingMachineService.dispenseProduct();
        console.log(`Dispensed: ${dispensedProduct.name}`);
        console.log(`Current state: ${vendingMachineService.getCurrentState()}`);
        console.log(`Current balance: ${vendingMachineService.getCurrentBalance()} cents`);
        
        // 5. Return change
        if (vendingMachineService.getCurrentState() === VendingMachineState.RETURNING_CHANGE) {
            console.log('\n5. Returning change');
            const change = vendingMachineService.returnChange();
            console.log(`Change returned: ${change.total} cents`);
            console.log(`Coins: ${change.coins.map(coin => coin.getName()).join(', ')}`);
            console.log(`Current state: ${vendingMachineService.getCurrentState()}`);
            console.log(`Current balance: ${vendingMachineService.getCurrentBalance()} cents`);
        }
        
        // 6. Select another product
        const anotherProductId = 'B2'; // Doritos
        console.log(`\n6. Selecting product ${anotherProductId}`);
        vendingMachineService.selectProduct(anotherProductId);
        console.log(`Current state: ${vendingMachineService.getCurrentState()}`);
        
        // 7. Insert insufficient coins
        console.log('\n7. Inserting insufficient coins');
        // Insert a quarter (25 cents)
        vendingMachineService.insertCoin(CoinType.QUARTER);
        console.log(`Inserted a Quarter. Current balance: ${vendingMachineService.getCurrentBalance()} cents`);
        
        // 8. Cancel the transaction
        console.log('\n8. Cancelling the transaction');
        const cancelChange = vendingMachineService.cancelTransaction();
        console.log(`Change returned: ${cancelChange.total} cents`);
        console.log(`Coins: ${cancelChange.coins.map(coin => coin.getName()).join(', ')}`);
        console.log(`Current state: ${vendingMachineService.getCurrentState()}`);
        
        // 9. Restock a product
        console.log('\n9. Restocking a product');
        vendingMachineService.restockProduct('A1', 5);
        const restockedProduct = vendingMachineService.getProduct('A1');
        console.log(`Restocked ${restockedProduct?.name}. New quantity: ${restockedProduct?.quantity}`);
        
        // 10. Check coin inventory
        console.log('\n10. Checking coin inventory');
        const coinInventory = vendingMachineService.getCoinInventoryArray();
        coinInventory.forEach(item => {
            console.log(`${item.name}: ${item.count}`);
        });
        
    } catch (error: any) {
        console.error('Error in demo:', error.message);
    }
}

// Run the demo
runDemo(); 