import { v4 as uuidv4 } from 'uuid';
import { Vehicle, VehicleType } from './Vehicle';
import { ParkingSpot, ParkingSpotType } from './ParkingSpot';
import { ParkingTicket, TicketStatus } from './ParkingTicket';

export class ParkingLot {
    id: string;
    name: string;
    address: string;
    floors: number;
    spotsPerFloor: number;
    spots: Map<string, ParkingSpot>;
    tickets: Map<string, ParkingTicket>;
    vehicleToTicketMap: Map<string, string>;
    
    constructor(name: string, address: string, floors: number, spotsPerFloor: number) {
        this.id = uuidv4();
        this.name = name;
        this.address = address;
        this.floors = floors;
        this.spotsPerFloor = spotsPerFloor;
        this.spots = new Map<string, ParkingSpot>();
        this.tickets = new Map<string, ParkingTicket>();
        this.vehicleToTicketMap = new Map<string, string>();
        
        this.initializeSpots();
    }
    
    private initializeSpots(): void {
        let spotNumber = 1;
        
        for (let floor = 1; floor <= this.floors; floor++) {
            // 10% motorcycle spots
            const motorcycleSpots = Math.floor(this.spotsPerFloor * 0.1);
            // 20% compact spots
            const compactSpots = Math.floor(this.spotsPerFloor * 0.2);
            // 60% regular spots
            const regularSpots = Math.floor(this.spotsPerFloor * 0.6);
            // 10% large spots
            const largeSpots = this.spotsPerFloor - motorcycleSpots - compactSpots - regularSpots;
            
            // Create motorcycle spots
            for (let i = 0; i < motorcycleSpots; i++) {
                const spot = new ParkingSpot(spotNumber++, floor, ParkingSpotType.MOTORCYCLE);
                this.spots.set(spot.id, spot);
            }
            
            // Create compact spots
            for (let i = 0; i < compactSpots; i++) {
                const spot = new ParkingSpot(spotNumber++, floor, ParkingSpotType.COMPACT);
                this.spots.set(spot.id, spot);
            }
            
            // Create regular spots
            for (let i = 0; i < regularSpots; i++) {
                const spot = new ParkingSpot(spotNumber++, floor, ParkingSpotType.REGULAR);
                this.spots.set(spot.id, spot);
            }
            
            // Create large spots
            for (let i = 0; i < largeSpots; i++) {
                const spot = new ParkingSpot(spotNumber++, floor, ParkingSpotType.LARGE);
                this.spots.set(spot.id, spot);
            }
        }
    }
    
    findAvailableSpot(vehicle: Vehicle): ParkingSpot | null {
        // First try to find the most appropriate spot type for the vehicle
        let targetSpotType: ParkingSpotType;
        
        switch (vehicle.type) {
            case VehicleType.MOTORCYCLE:
                targetSpotType = ParkingSpotType.MOTORCYCLE;
                break;
            case VehicleType.CAR:
                targetSpotType = ParkingSpotType.COMPACT;
                break;
            case VehicleType.BUS:
            case VehicleType.TRUCK:
                targetSpotType = ParkingSpotType.LARGE;
                break;
            default:
                targetSpotType = ParkingSpotType.REGULAR;
        }
        
        // Try to find a spot of the target type
        for (const spot of this.spots.values()) {
            if (!spot.isOccupied && spot.type === targetSpotType && spot.canFitVehicle(vehicle)) {
                return spot;
            }
        }
        
        // If no spot of the target type is available, try any spot that can fit the vehicle
        for (const spot of this.spots.values()) {
            if (!spot.isOccupied && spot.canFitVehicle(vehicle)) {
                return spot;
            }
        }
        
        return null; // No available spot found
    }
    
    parkVehicle(vehicle: Vehicle): ParkingTicket | null {
        // Check if vehicle is already parked
        if (this.vehicleToTicketMap.has(vehicle.id)) {
            return null;
        }
        
        // Find an available spot
        const spot = this.findAvailableSpot(vehicle);
        if (!spot) {
            return null; // No available spot
        }
        
        // Park the vehicle
        if (!spot.parkVehicle(vehicle)) {
            return null; // Failed to park
        }
        
        // Create a ticket
        const ticket = new ParkingTicket(vehicle, spot);
        this.tickets.set(ticket.id, ticket);
        this.vehicleToTicketMap.set(vehicle.id, ticket.id);
        
        return ticket;
    }
    
    getTicket(ticketId: string): ParkingTicket | null {
        return this.tickets.get(ticketId) || null;
    }
    
    getTicketByVehicle(vehicleId: string): ParkingTicket | null {
        const ticketId = this.vehicleToTicketMap.get(vehicleId);
        if (!ticketId) {
            return null;
        }
        return this.tickets.get(ticketId) || null;
    }
    
    exitVehicle(ticketId: string): ParkingTicket | null {
        const ticket = this.tickets.get(ticketId);
        if (!ticket || ticket.status !== TicketStatus.ACTIVE) {
            return null;
        }
        
        const spot = this.spots.get(ticket.spotId);
        if (!spot) {
            return null;
        }
        
        // Remove vehicle from spot
        const vehicle = spot.removeVehicle();
        if (!vehicle) {
            return null;
        }
        
        // Update ticket
        ticket.markAsExited();
        
        // Remove from vehicle to ticket map
        this.vehicleToTicketMap.delete(vehicle.id);
        
        return ticket;
    }
    
    calculateFee(ticket: ParkingTicket): number {
        if (ticket.status === TicketStatus.LOST) {
            // Lost ticket fee
            return 100;
        }
        
        const duration = ticket.getDuration();
        
        // Basic fee calculation: $2 per hour, minimum 1 hour
        const hours = Math.max(1, Math.ceil(duration));
        return hours * 2;
    }
    
    processPayment(ticketId: string): boolean {
        const ticket = this.tickets.get(ticketId);
        if (!ticket || ticket.status !== TicketStatus.ACTIVE || !ticket.exitTime) {
            return false;
        }
        
        const fee = this.calculateFee(ticket);
        ticket.markAsPaid(fee);
        
        return true;
    }
    
    getAvailableSpots(): number {
        let count = 0;
        for (const spot of this.spots.values()) {
            if (!spot.isOccupied) {
                count++;
            }
        }
        return count;
    }
    
    getAvailableSpotsByType(type: ParkingSpotType): number {
        let count = 0;
        for (const spot of this.spots.values()) {
            if (!spot.isOccupied && spot.type === type) {
                count++;
            }
        }
        return count;
    }
    
    getOccupiedSpots(): number {
        return this.spots.size - this.getAvailableSpots();
    }
} 