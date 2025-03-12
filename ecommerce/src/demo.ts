import { EcommerceService } from './services/EcommerceService';
import { UserRole } from './models/User';
import { ProductCategory } from './models/Product';
import { PaymentMethod, OrderStatus } from './models/Order';

async function runDemo() {
    console.log('Starting E-commerce System Demo...');
    console.log('==================================\n');
    
    const service = new EcommerceService();
    
    // The service constructor already initializes demo data
    // Let's retrieve and display it
    
    // 1. Get all products
    console.log('Available Products:');
    console.log('------------------');
    const products = service.getAllProducts();
    products.forEach(product => {
        console.log(`${product.id}: ${product.name} - ₹${product.price} (${product.inventory} in stock)`);
    });
    console.log();
    
    // 2. Get user by email
    const user = service.getUserByEmail('john@example.com');
    if (!user) {
        console.log('Demo user not found!');
        return;
    }
    
    console.log(`User: ${user.name} (${user.email})`);
    console.log('Addresses:');
    user.addresses.forEach(address => {
        console.log(`- ${address.id}: ${address.line1}, ${address.city}, ${address.state}, ${address.pincode}`);
    });
    console.log();
    
    // 3. Add products to cart
    const firstProduct = products[0];
    const secondProduct = products[1];
    
    console.log(`Adding ${firstProduct.name} to cart...`);
    service.addToCart(user.id, firstProduct.id, 1);
    
    console.log(`Adding ${secondProduct.name} to cart...`);
    service.addToCart(user.id, secondProduct.id, 2);
    
    // 4. View cart
    const cart = service.getCart(user.id);
    console.log('\nCart Contents:');
    console.log('-------------');
    cart.items.forEach(item => {
        const product = service.getProduct(item.productId);
        console.log(`${product.name} x ${item.quantity} = ₹${item.price * item.quantity}`);
    });
    console.log(`Total: ₹${cart.getTotalPrice()}`);
    console.log();
    
    // 5. Create an order
    if (user.addresses.length === 0) {
        console.log('No address available for delivery!');
        return;
    }
    
    const addressId = user.addresses[0].id;
    console.log('Creating order...');
    const order = service.createOrder(user.id, addressId, PaymentMethod.CREDIT_CARD);
    
    console.log('\nOrder Created:');
    console.log('-------------');
    console.log(`Order ID: ${order.id}`);
    console.log(`Status: ${order.status}`);
    console.log(`Items:`);
    order.items.forEach(item => {
        console.log(`- ${item.productName} x ${item.quantity} = ₹${item.price * item.quantity}`);
    });
    console.log(`Total: ₹${order.getTotalPrice()}`);
    console.log(`Payment Status: ${order.payment?.status || 'No payment'}`);
    console.log();
    
    // 6. Process payment
    console.log('Processing payment...');
    if (order.payment) {
        const paymentSuccess = service.processPayment(order.payment.id);
        
        if (paymentSuccess) {
            console.log('Payment successful!');
            
            // Get updated order
            const updatedOrder = service.getOrder(order.id);
            console.log(`Order status updated to: ${updatedOrder.status}`);
            console.log(`Payment status updated to: ${updatedOrder.payment?.status || 'No payment'}`);
        } else {
            console.log('Payment failed!');
        }
    } else {
        console.log('No payment to process!');
    }
    
    // 7. Check inventory after order
    console.log('\nUpdated Inventory:');
    console.log('-----------------');
    [firstProduct.id, secondProduct.id].forEach(productId => {
        const product = service.getProduct(productId);
        console.log(`${product.name}: ${product.inventory} in stock`);
    });
    
    // 8. Search for products
    console.log('\nSearch Results for "laptop":');
    console.log('---------------------------');
    const searchResults = service.searchProducts('laptop');
    searchResults.forEach(product => {
        console.log(`${product.name} - ₹${product.price}`);
    });
    
    console.log('\nDemo completed successfully!');
}

// Run the demo
runDemo().catch(error => {
    console.error('Demo failed with error:', error);
}); 