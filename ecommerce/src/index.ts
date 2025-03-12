import express from 'express';
import { EcommerceController } from './controllers/EcommerceController';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize controller
const controller = new EcommerceController();

// User routes
app.post('/api/users/register', controller.registerUser);
app.get('/api/users/:userId', controller.getUser);
app.post('/api/users/:userId/addresses', controller.addUserAddress);

// Product routes
app.post('/api/products', controller.addProduct);
app.get('/api/products', controller.getAllProducts);
app.get('/api/products/search', controller.searchProducts);
app.get('/api/products/category/:category', controller.getProductsByCategory);
app.get('/api/products/:productId', controller.getProduct);
app.put('/api/products/:productId/inventory', controller.updateProductInventory);

// Cart routes
app.get('/api/users/:userId/cart', controller.getCart);
app.post('/api/users/:userId/cart', controller.addToCart);
app.delete('/api/users/:userId/cart/items/:itemId', controller.removeFromCart);
app.delete('/api/users/:userId/cart', controller.clearCart);

// Order routes
app.post('/api/users/:userId/orders', controller.createOrder);
app.get('/api/users/:userId/orders', controller.getUserOrders);
app.get('/api/orders/:orderId', controller.getOrder);
app.put('/api/orders/:orderId/status', controller.updateOrderStatus);

// Payment routes
app.post('/api/payments/:paymentId/process', controller.processPayment);

// Start server
app.listen(port, () => {
    console.log(`E-commerce API server running on port ${port}`);
}); 