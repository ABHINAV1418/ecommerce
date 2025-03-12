import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from './Vehicle';
import { ParkingSpot } from './ParkingSpot';

export enum TicketStatus {
    ACTIVE = 'ACTIVE',
    PAID = 'PAID',
    LOST = 'LOST'
}

export class ParkingTicket {
    id: string;
    vehicleId: string;
    spotId: string;
    entryTime: Date;
    exitTime: Date | null;
    status: TicketStatus;
    amount: number;
    
    constructor(vehicle: Vehicle, spot: ParkingSpot) {
        this.id = uuidv4();
        this.vehicleId = vehicle.id;
        this.spotId = spot.id;
        this.entryTime = new Date();
        this.exitTime = null;
        this.status = TicketStatus.ACTIVE;
        this.amount = 0;
    }
    
    markAsExited(): void {
        this.exitTime = new Date();
    }
    
    markAsPaid(amount: number): void {
        this.status = TicketStatus.PAID;
        this.amount = amount;
    }
    
    markAsLost(): void {
        this.status = TicketStatus.LOST;
        // Additional fee for lost ticket could be added here
    }
    
    getDuration(): number {
        if (!this.exitTime) {
            return 0;
        }
        
        // Return duration in hours
        const durationMs = this.exitTime.getTime() - this.entryTime.getTime();
        return durationMs / (1000 * 60 * 60);
    }
} 