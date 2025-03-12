import { Vehicle, VehicleType } from '../models/Vehicle';
import { ParkingLot } from '../models/ParkingLot';
import { ParkingSpotType } from '../models/ParkingSpot';
import { ParkingTicket, TicketStatus } from '../models/ParkingTicket';

export class ParkingService {
    private parkingLot: ParkingLot;
    
    constructor(name: string, address: string, floors: number, spotsPerFloor: number) {
        this.parkingLot = new ParkingLot(name, address, floors, spotsPerFloor);
    }
    
    // Vehicle operations
    createVehicle(licenseNumber: string, type: VehicleType): Vehicle {
        return new Vehicle(licenseNumber, type);
    }
    
    // Parking operations
    parkVehicle(vehicle: Vehicle): ParkingTicket | null {
        return this.parkingLot.parkVehicle(vehicle);
    }
    
    exitVehicle(ticketId: string): ParkingTicket | null {
        return this.parkingLot.exitVehicle(ticketId);
    }
    
    processPayment(ticketId: string): boolean {
        return this.parkingLot.processPayment(ticketId);
    }
    
    calculateFee(ticketId: string): number {
        const ticket = this.parkingLot.getTicket(ticketId);
        if (!ticket) {
            return 0;
        }
        return this.parkingLot.calculateFee(ticket);
    }
    
    // Ticket operations
    getTicket(ticketId: string): ParkingTicket | null {
        return this.parkingLot.getTicket(ticketId);
    }
    
    getTicketByVehicle(vehicleId: string): ParkingTicket | null {
        return this.parkingLot.getTicketByVehicle(vehicleId);
    }
    
    reportLostTicket(vehicleId: string): boolean {
        const ticket = this.parkingLot.getTicketByVehicle(vehicleId);
        if (!ticket || ticket.status !== TicketStatus.ACTIVE) {
            return false;
        }
        
        ticket.markAsLost();
        return true;
    }
    
    // Status operations
    getAvailableSpots(): number {
        return this.parkingLot.getAvailableSpots();
    }
    
    getAvailableSpotsByType(type: ParkingSpotType): number {
        return this.parkingLot.getAvailableSpotsByType(type);
    }
    
    getOccupiedSpots(): number {
        return this.parkingLot.getOccupiedSpots();
    }
    
    getParkingLotInfo(): {
        name: string;
        address: string;
        floors: number;
        totalSpots: number;
        availableSpots: number;
        occupiedSpots: number;
    } {
        return {
            name: this.parkingLot.name,
            address: this.parkingLot.address,
            floors: this.parkingLot.floors,
            totalSpots: this.parkingLot.spots.size,
            availableSpots: this.getAvailableSpots(),
            occupiedSpots: this.getOccupiedSpots()
        };
    }
} 