import { UberSystem } from '../models/UberSystem';
import { UserType } from '../models/User';
import { VehicleType } from '../models/Vehicle';
import { PaymentMethod } from '../models/Payment';

export class UberService {
    private uberSystem: UberSystem;

    constructor() {
        this.uberSystem = new UberSystem();
    }

    // User Management
    registerRider(name: string, email: string, phone: string) {
        return this.uberSystem.registerUser(name, email, phone, UserType.RIDER);
    }

    registerDriver(name: string, email: string, phone: string) {
        return this.uberSystem.registerUser(name, email, phone, UserType.DRIVER);
    }

    getUser(userId: string) {
        return this.uberSystem.getUser(userId);
    }

    getAllUsers() {
        return this.uberSystem.getAllUsers();
    }

    updateUserLocation(userId: string, latitude: number, longitude: number) {
        this.uberSystem.updateUserLocation(userId, latitude, longitude);
    }

    // Vehicle Management
    registerVehicle(driverId: string, make: string, model: string, year: number, licensePlate: string, type: VehicleType, capacity: number) {
        return this.uberSystem.registerVehicle(driverId, make, model, year, licensePlate, type, capacity);
    }

    getVehicle(vehicleId: string) {
        return this.uberSystem.getVehicle(vehicleId);
    }

    getDriverVehicles(driverId: string) {
        return this.uberSystem.getDriverVehicles(driverId);
    }

    updateVehicleAvailability(vehicleId: string, available: boolean) {
        this.uberSystem.updateVehicleAvailability(vehicleId, available);
    }

    // Trip Management
    requestTrip(riderId: string, pickupLatitude: number, pickupLongitude: number, dropoffLatitude: number, dropoffLongitude: number, vehicleType: VehicleType = VehicleType.ECONOMY) {
        return this.uberSystem.requestTrip(riderId, pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude, vehicleType);
    }

    findDriver(tripId: string) {
        return this.uberSystem.findDriver(tripId);
    }

    startTrip(tripId: string) {
        this.uberSystem.startTrip(tripId);
    }

    completeTrip(tripId: string) {
        this.uberSystem.completeTrip(tripId);
    }

    cancelTrip(tripId: string) {
        this.uberSystem.cancelTrip(tripId);
    }

    rateTrip(tripId: string, rating: number) {
        this.uberSystem.rateTrip(tripId, rating);
    }

    getTrip(tripId: string) {
        return this.uberSystem.getTrip(tripId);
    }

    getUserTrips(userId: string) {
        return this.uberSystem.getUserTrips(userId);
    }

    // Payment Management
    getPayment(paymentId: string) {
        return this.uberSystem.getPayment(paymentId);
    }

    getTripPayment(tripId: string) {
        return this.uberSystem.getTripPayment(tripId);
    }
} 