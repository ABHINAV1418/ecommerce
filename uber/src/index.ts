import express from 'express';
import { UberService } from './services/UberService';
import { UberController } from './controllers/UberController';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize services and controllers
const uberService = new UberService();
const uberController = new UberController(uberService);

// User routes
app.post('/api/riders', uberController.registerRider);
app.post('/api/drivers', uberController.registerDriver);
app.get('/api/users/:userId', uberController.getUser);
app.put('/api/users/:userId/location', uberController.updateUserLocation);

// Vehicle routes
app.post('/api/vehicles', uberController.registerVehicle);
app.get('/api/vehicles/:vehicleId', uberController.getVehicle);
app.get('/api/drivers/:driverId/vehicles', uberController.getDriverVehicles);
app.put('/api/vehicles/:vehicleId/availability', uberController.updateVehicleAvailability);

// Trip routes
app.post('/api/trips', uberController.requestTrip);
app.post('/api/trips/:tripId/find-driver', uberController.findDriver);
app.put('/api/trips/:tripId/start', uberController.startTrip);
app.put('/api/trips/:tripId/complete', uberController.completeTrip);
app.put('/api/trips/:tripId/cancel', uberController.cancelTrip);
app.put('/api/trips/:tripId/rate', uberController.rateTrip);
app.get('/api/trips/:tripId', uberController.getTrip);
app.get('/api/users/:userId/trips', uberController.getUserTrips);

// Start the server
app.listen(port, () => {
    console.log(`Uber API server running on port ${port}`);
}); 