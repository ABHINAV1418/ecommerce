import { VehicleType } from './Vehicle';

export enum TripStatus {
    REQUESTED = 'REQUESTED',
    DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
    STARTED = 'STARTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class Trip {
    id: string;
    riderId: string;
    driverId?: string;
    vehicleId?: string;
    pickupLocation: { latitude: number, longitude: number };
    dropoffLocation: { latitude: number, longitude: number };
    requestTime: Date;
    startTime?: Date;
    endTime?: Date;
    status: TripStatus;
    fare?: number;
    distance?: number;
    vehicleType: VehicleType;
    rating?: number;

    constructor(
        id: string,
        riderId: string,
        pickupLocation: { latitude: number, longitude: number },
        dropoffLocation: { latitude: number, longitude: number },
        vehicleType: VehicleType = VehicleType.ECONOMY
    ) {
        this.id = id;
        this.riderId = riderId;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.requestTime = new Date();
        this.status = TripStatus.REQUESTED;
        this.vehicleType = vehicleType;
    }

    assignDriver(driverId: string, vehicleId: string): void {
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.status = TripStatus.DRIVER_ASSIGNED;
    }

    startTrip(): void {
        this.startTime = new Date();
        this.status = TripStatus.STARTED;
    }

    completeTrip(fare: number, distance: number): void {
        this.endTime = new Date();
        this.fare = fare;
        this.distance = distance;
        this.status = TripStatus.COMPLETED;
    }

    cancelTrip(): void {
        this.status = TripStatus.CANCELLED;
    }

    rateTrip(rating: number): void {
        this.rating = Math.max(1, Math.min(5, rating));
    }
} 