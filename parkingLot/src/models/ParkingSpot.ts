import { v4 as uuidv4 } from 'uuid';
import { Vehicle, VehicleSize } from './Vehicle';

export enum ParkingSpotType {
    MOTORCYCLE = 'MOTORCYCLE',
    COMPACT = 'COMPACT',
    REGULAR = 'REGULAR',
    LARGE = 'LARGE'
}

export class ParkingSpot {
    id: string;
    spotNumber: number;
    floor: number;
    type: ParkingSpotType;
    isOccupied: boolean;
    vehicle: Vehicle | null;
    
    constructor(spotNumber: number, floor: number, type: ParkingSpotType) {
        this.id = uuidv4();
        this.spotNumber = spotNumber;
        this.floor = floor;
        this.type = type;
        this.isOccupied = false;
        this.vehicle = null;
    }
    
    canFitVehicle(vehicle: Vehicle): boolean {
        if (this.isOccupied) {
            return false;
        }
        
        // Check if the vehicle size can fit in this spot type
        switch (this.type) {
            case ParkingSpotType.MOTORCYCLE:
                return vehicle.size === VehicleSize.SMALL;
            case ParkingSpotType.COMPACT:
                return vehicle.size === VehicleSize.SMALL || vehicle.size === VehicleSize.MEDIUM;
            case ParkingSpotType.REGULAR:
                return vehicle.size === VehicleSize.SMALL || vehicle.size === VehicleSize.MEDIUM || vehicle.size === VehicleSize.LARGE;
            case ParkingSpotType.LARGE:
                return true; // Can fit any vehicle
            default:
                return false;
        }
    }
    
    parkVehicle(vehicle: Vehicle): boolean {
        if (this.isOccupied || !this.canFitVehicle(vehicle)) {
            return false;
        }
        
        this.vehicle = vehicle;
        this.isOccupied = true;
        return true;
    }
    
    removeVehicle(): Vehicle | null {
        if (!this.isOccupied || !this.vehicle) {
            return null;
        }
        
        const vehicle = this.vehicle;
        this.vehicle = null;
        this.isOccupied = false;
        return vehicle;
    }
} 