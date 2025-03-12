import express from 'express';
import { OrderManagementController } from './controllers/OrderManagementController';
import { OrderManagementService } from './services/OrderManagementService';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize service and controller
const orderManagementService = new OrderManagementService();
const orderManagementController = new OrderManagementController(orderManagementService);

// Routes
// Product routes
app.post('/api/products', orderManagementController.addProduct);
app.get('/api/products', orderManagementController.getAllProducts);
app.get('/api/products/:productId/stock', orderManagementController.getStock);

// Order routes
app.post('/api/orders', orderManagementController.createOrder);
app.get('/api/orders', orderManagementController.getAllOrders);
app.get('/api/orders/:orderId', orderManagementController.getOrder);
app.post('/api/orders/:orderId/confirm', orderManagementController.confirmOrder);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Hot reloading enabled - changes will automatically restart the server');
});

// For demonstration purposes, export the service
export const orderService = orderManagementService;
