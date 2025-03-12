import express from 'express';
import { VendingMachineController } from './controllers/VendingMachineController';
import { VendingMachineService } from './services/VendingMachineService';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize service and controller
const vendingMachineService = new VendingMachineService();
const vendingMachineController = new VendingMachineController(vendingMachineService);

// Routes
// Product routes
app.get('/api/products', vendingMachineController.getAllProducts);
app.get('/api/products/:productId', vendingMachineController.getProduct);
app.post('/api/products/restock', vendingMachineController.restockProduct);

// Vending machine operation routes
app.post('/api/select', vendingMachineController.selectProduct);
app.post('/api/insert-coin', vendingMachineController.insertCoin);
app.post('/api/dispense', vendingMachineController.dispenseProduct);
app.post('/api/return-change', vendingMachineController.returnChange);
app.post('/api/cancel', vendingMachineController.cancelTransaction);

// Admin routes
app.post('/api/coins/restock', vendingMachineController.restockCoins);
app.get('/api/state', vendingMachineController.getState);
app.get('/api/coins', vendingMachineController.getCoinInventory);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// For demonstration purposes, export the service
export const vendingService = vendingMachineService; 