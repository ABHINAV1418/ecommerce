import { Request, Response } from 'express';
import { ParkingService } from '../services/ParkingService';
import { VehicleType } from '../models/Vehicle';
import { ParkingSpotType } from '../models/ParkingSpot';

export class ParkingController {
    private parkingService: ParkingService;
    
    constructor(parkingService: ParkingService) {
        this.parkingService = parkingService;
    }
    
    // Vehicle operations
    createVehicle = (req: Request, res: Response): void => {
        try {
            const { licenseNumber, type } = req.body;
            
            if (!licenseNumber || !type) {
                res.status(400).json({ error: 'License number and vehicle type are required' });
                return;
            }
            
            // Validate vehicle type
            if (!Object.values(VehicleType).includes(type)) {
                res.status(400).json({ error: 'Invalid vehicle type' });
                return;
            }
            
            const vehicle = this.parkingService.createVehicle(licenseNumber, type);
            res.status(201).json(vehicle);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create vehicle' });
        }
    };
    
    // Parking operations
    parkVehicle = (req: Request, res: Response): void => {
        try {
            const { licenseNumber, type } = req.body;
            
            if (!licenseNumber || !type) {
                res.status(400).json({ error: 'License number and vehicle type are required' });
                return;
            }
            
            // Validate vehicle type
            if (!Object.values(VehicleType).includes(type)) {
                res.status(400).json({ error: 'Invalid vehicle type' });
                return;
            }
            
            const vehicle = this.parkingService.createVehicle(licenseNumber, type);
            const ticket = this.parkingService.parkVehicle(vehicle);
            
            if (!ticket) {
                res.status(400).json({ error: 'Failed to park vehicle. No available spots or vehicle already parked.' });
                return;
            }
            
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Failed to park vehicle' });
        }
    };
    
    exitVehicle = (req: Request, res: Response): void => {
        try {
            const { ticketId } = req.params;
            
            if (!ticketId) {
                res.status(400).json({ error: 'Ticket ID is required' });
                return;
            }
            
            const ticket = this.parkingService.exitVehicle(ticketId);
            
            if (!ticket) {
                res.status(400).json({ error: 'Failed to exit vehicle. Invalid ticket or vehicle not found.' });
                return;
            }
            
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Failed to exit vehicle' });
        }
    };
    
    processPayment = (req: Request, res: Response): void => {
        try {
            const { ticketId } = req.params;
            
            if (!ticketId) {
                res.status(400).json({ error: 'Ticket ID is required' });
                return;
            }
            
            const success = this.parkingService.processPayment(ticketId);
            
            if (!success) {
                res.status(400).json({ error: 'Failed to process payment. Invalid ticket or payment already processed.' });
                return;
            }
            
            const fee = this.parkingService.calculateFee(ticketId);
            res.status(200).json({ success: true, fee });
        } catch (error) {
            res.status(500).json({ error: 'Failed to process payment' });
        }
    };
    
    calculateFee = (req: Request, res: Response): void => {
        try {
            const { ticketId } = req.params;
            
            if (!ticketId) {
                res.status(400).json({ error: 'Ticket ID is required' });
                return;
            }
            
            const fee = this.parkingService.calculateFee(ticketId);
            res.status(200).json({ fee });
        } catch (error) {
            res.status(500).json({ error: 'Failed to calculate fee' });
        }
    };
    
    // Ticket operations
    getTicket = (req: Request, res: Response): void => {
        try {
            const { ticketId } = req.params;
            
            if (!ticketId) {
                res.status(400).json({ error: 'Ticket ID is required' });
                return;
            }
            
            const ticket = this.parkingService.getTicket(ticketId);
            
            if (!ticket) {
                res.status(404).json({ error: 'Ticket not found' });
                return;
            }
            
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get ticket' });
        }
    };
    
    getTicketByVehicle = (req: Request, res: Response): void => {
        try {
            const { vehicleId } = req.params;
            
            if (!vehicleId) {
                res.status(400).json({ error: 'Vehicle ID is required' });
                return;
            }
            
            const ticket = this.parkingService.getTicketByVehicle(vehicleId);
            
            if (!ticket) {
                res.status(404).json({ error: 'Ticket not found for this vehicle' });
                return;
            }
            
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get ticket by vehicle' });
        }
    };
    
    reportLostTicket = (req: Request, res: Response): void => {
        try {
            const { vehicleId } = req.params;
            
            if (!vehicleId) {
                res.status(400).json({ error: 'Vehicle ID is required' });
                return;
            }
            
            const success = this.parkingService.reportLostTicket(vehicleId);
            
            if (!success) {
                res.status(400).json({ error: 'Failed to report lost ticket. Vehicle not found or ticket already processed.' });
                return;
            }
            
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to report lost ticket' });
        }
    };
    
    // Status operations
    getParkingStatus = (req: Request, res: Response): void => {
        try {
            const info = this.parkingService.getParkingLotInfo();
            const availableByType = {
                motorcycle: this.parkingService.getAvailableSpotsByType(ParkingSpotType.MOTORCYCLE),
                compact: this.parkingService.getAvailableSpotsByType(ParkingSpotType.COMPACT),
                regular: this.parkingService.getAvailableSpotsByType(ParkingSpotType.REGULAR),
                large: this.parkingService.getAvailableSpotsByType(ParkingSpotType.LARGE)
            };
            
            res.status(200).json({
                ...info,
                availableByType
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get parking status' });
        }
    };
} 