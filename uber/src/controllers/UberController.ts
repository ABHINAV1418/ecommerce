import { Request, Response } from 'express';
import { UberService } from '../services/UberService';
import { VehicleType } from '../models/Vehicle';

export class UberController {
    private uberService: UberService;

    constructor(uberService: UberService) {
        this.uberService = uberService;
    }

    // User Management
    registerRider = (req: Request, res: Response): void => {
        try {
            const { name, email, phone } = req.body;
            if (!name || !email || !phone) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const rider = this.uberService.registerRider(name, email, phone);
            res.status(201).json(rider);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    registerDriver = (req: Request, res: Response): void => {
        try {
            const { name, email, phone } = req.body;
            if (!name || !email || !phone) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const driver = this.uberService.registerDriver(name, email, phone);
            res.status(201).json(driver);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getUser = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const user = this.uberService.getUser(userId);
            
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    updateUserLocation = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const { latitude, longitude } = req.body;
            
            if (latitude === undefined || longitude === undefined) {
                res.status(400).json({ error: 'Missing location coordinates' });
                return;
            }
            
            this.uberService.updateUserLocation(userId, latitude, longitude);
            res.status(200).json({ message: 'Location updated successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Vehicle Management
    registerVehicle = (req: Request, res: Response): void => {
        try {
            const { driverId, make, model, year, licensePlate, type, capacity } = req.body;
            
            if (!driverId || !make || !model || !year || !licensePlate) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            
            const vehicleType = type as VehicleType || VehicleType.ECONOMY;
            const vehicleCapacity = capacity || 4;
            
            const vehicle = this.uberService.registerVehicle(
                driverId, make, model, year, licensePlate, vehicleType, vehicleCapacity
            );
            
            res.status(201).json(vehicle);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getVehicle = (req: Request, res: Response): void => {
        try {
            const vehicleId = req.params.vehicleId;
            const vehicle = this.uberService.getVehicle(vehicleId);
            
            if (!vehicle) {
                res.status(404).json({ error: 'Vehicle not found' });
                return;
            }
            
            res.status(200).json(vehicle);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getDriverVehicles = (req: Request, res: Response): void => {
        try {
            const driverId = req.params.driverId;
            const vehicles = this.uberService.getDriverVehicles(driverId);
            res.status(200).json(vehicles);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    updateVehicleAvailability = (req: Request, res: Response): void => {
        try {
            const vehicleId = req.params.vehicleId;
            const { available } = req.body;
            
            if (available === undefined) {
                res.status(400).json({ error: 'Missing availability status' });
                return;
            }
            
            this.uberService.updateVehicleAvailability(vehicleId, available);
            res.status(200).json({ message: 'Vehicle availability updated successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Trip Management
    requestTrip = (req: Request, res: Response): void => {
        try {
            const { 
                riderId, 
                pickupLatitude, 
                pickupLongitude, 
                dropoffLatitude, 
                dropoffLongitude, 
                vehicleType 
            } = req.body;
            
            if (!riderId || pickupLatitude === undefined || pickupLongitude === undefined || 
                dropoffLatitude === undefined || dropoffLongitude === undefined) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            
            const trip = this.uberService.requestTrip(
                riderId, 
                pickupLatitude, 
                pickupLongitude, 
                dropoffLatitude, 
                dropoffLongitude, 
                vehicleType as VehicleType
            );
            
            res.status(201).json(trip);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    findDriver = (req: Request, res: Response): void => {
        try {
            const tripId = req.params.tripId;
            const driver = this.uberService.findDriver(tripId);
            
            if (!driver) {
                res.status(404).json({ error: 'No available drivers found' });
                return;
            }
            
            res.status(200).json(driver);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    startTrip = (req: Request, res: Response): void => {
        try {
            const tripId = req.params.tripId;
            this.uberService.startTrip(tripId);
            res.status(200).json({ message: 'Trip started successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    completeTrip = (req: Request, res: Response): void => {
        try {
            const tripId = req.params.tripId;
            this.uberService.completeTrip(tripId);
            
            const trip = this.uberService.getTrip(tripId);
            const payment = this.uberService.getTripPayment(tripId);
            
            res.status(200).json({ 
                message: 'Trip completed successfully',
                trip,
                payment
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    cancelTrip = (req: Request, res: Response): void => {
        try {
            const tripId = req.params.tripId;
            this.uberService.cancelTrip(tripId);
            res.status(200).json({ message: 'Trip cancelled successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    rateTrip = (req: Request, res: Response): void => {
        try {
            const tripId = req.params.tripId;
            const { rating } = req.body;
            
            if (rating === undefined) {
                res.status(400).json({ error: 'Missing rating' });
                return;
            }
            
            this.uberService.rateTrip(tripId, rating);
            res.status(200).json({ message: 'Trip rated successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getTrip = (req: Request, res: Response): void => {
        try {
            const tripId = req.params.tripId;
            const trip = this.uberService.getTrip(tripId);
            
            if (!trip) {
                res.status(404).json({ error: 'Trip not found' });
                return;
            }
            
            res.status(200).json(trip);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getUserTrips = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const trips = this.uberService.getUserTrips(userId);
            res.status(200).json(trips);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
} 