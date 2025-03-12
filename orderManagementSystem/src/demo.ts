import { OrderManagementService } from './services/OrderManagementService';

// Create a new instance of the OrderManagementService
const orderManagementService = new OrderManagementService();

// Demo function to showcase all the APIs
function runDemo() {
    console.log('=== Order Management System Demo ===');
    
    try {
        // 1. Add products
        console.log('\n1. Adding products');
        orderManagementService.addProduct('p1', 100);
        orderManagementService.addProduct('p2', 50);
        orderManagementService.addProduct('p3', 75);
        
        // 2. Get stock
        console.log('\n2. Getting stock');
        console.log(`Stock of p1: ${orderManagementService.getStock('p1')}`);
        console.log(`Stock of p2: ${orderManagementService.getStock('p2')}`);
        console.log(`Stock of p3: ${orderManagementService.getStock('p3')}`);
        
        // 3. Create an order
        console.log('\n3. Creating an order');
        const order1 = orderManagementService.createOrder('order1', [
            { productId: 'p1', quantity: 10 },
            { productId: 'p2', quantity: 5 }
        ]);
        console.log('Order created:', order1);
        
        // 4. Confirm the order
        console.log('\n4. Confirming the order');
        const confirmedOrder = orderManagementService.confirmOrder('order1');
        console.log('Order confirmed:', confirmedOrder);
        
        // 5. Check stock after order confirmation
        console.log('\n5. Checking stock after order confirmation');
        console.log(`Stock of p1: ${orderManagementService.getStock('p1')}`); // Should be 90
        console.log(`Stock of p2: ${orderManagementService.getStock('p2')}`); // Should be 45
        
        // 6. Try to create an order with insufficient stock
        console.log('\n6. Trying to create an order with insufficient stock');
        try {
            orderManagementService.createOrder('order2', [
                { productId: 'p2', quantity: 100 } // Only 45 in stock
            ]);
        } catch (error: any) {
            console.log('Error:', error.message);
        }
        
        // 7. Create another valid order
        console.log('\n7. Creating another valid order');
        const order3 = orderManagementService.createOrder('order3', [
            { productId: 'p3', quantity: 20 }
        ]);
        console.log('Order created:', order3);
        
        // 8. Get all orders
        console.log('\n8. Getting all orders');
        const allOrders = orderManagementService.getAllOrders();
        console.log(`Total orders: ${allOrders.length}`);
        
        // 9. Get all products
        console.log('\n9. Getting all products');
        const allProducts = orderManagementService.getAllProducts();
        console.log(`Total products: ${allProducts.length}`);
        
    } catch (error: any) {
        console.error('Error in demo:', error.message);
    }
}

// Run the demo
runDemo(); 