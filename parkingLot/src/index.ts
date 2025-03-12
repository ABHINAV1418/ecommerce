import express from 'express';
import { ParkingService } from './services/ParkingService';
import { ParkingController } from './controllers/ParkingController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize service and controller
const parkingService = new ParkingService('Downtown Parking', '123 Main St', 5, 20);
const parkingController = new ParkingController(parkingService);

// Routes
// Vehicle routes
app.post('/api/vehicles', parkingController.createVehicle);

// Parking routes
app.post('/api/parking', parkingController.parkVehicle);
app.put('/api/parking/:ticketId/exit', parkingController.exitVehicle);
app.post('/api/parking/:ticketId/payment', parkingController.processPayment);
app.get('/api/parking/:ticketId/fee', parkingController.calculateFee);

// Ticket routes
app.get('/api/tickets/:ticketId', parkingController.getTicket);
app.get('/api/vehicles/:vehicleId/ticket', parkingController.getTicketByVehicle);
app.post('/api/vehicles/:vehicleId/lost-ticket', parkingController.reportLostTicket);

// Status routes
app.get('/api/parking/status', parkingController.getParkingStatus);

// Start server
app.listen(PORT, () => {
    console.log(`Parking Lot API server running on http://localhost:${PORT}`);
}); 