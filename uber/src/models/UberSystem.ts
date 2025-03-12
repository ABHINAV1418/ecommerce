import { User, UserType } from './User';
import { Vehicle, VehicleType } from './Vehicle';
import { Trip, TripStatus } from './Trip';
import { Payment, PaymentMethod, PaymentStatus } from './Payment';

export class UberSystem {
    private users: Map<string, User>;
    private vehicles: Map<string, Vehicle>;
    private trips: Map<string, Trip>;
    private payments: Map<string, Payment>;
    private nextId: number;

    constructor() {
        this.users = new Map<string, User>();
        this.vehicles = new Map<string, Vehicle>();
        this.trips = new Map<string, Trip>();
        this.payments = new Map<string, Payment>();
        this.nextId = 1;
    }

    // User Management
    registerUser(name: string, email: string, phone: string, type: UserType): User {
        const id = `user_${this.nextId++}`;
        const user = new User(id, name, email, phone, type);
        this.users.set(id, user);
        return user;
    }

    getUser(userId: string): User | undefined {
        return this.users.get(userId);
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    updateUserLocation(userId: string, latitude: number, longitude: number): void {
        const user = this.users.get(userId);
        if (user) {
            user.updateLocation(latitude, longitude);
        } else {
            throw new Error('User not found');
        }
    }

    // Vehicle Management
    registerVehicle(
        driverId: string,
        make: string,
        model: string,
        year: number,
        licensePlate: string,
        type: VehicleType,
        capacity: number
    ): Vehicle {
        const driver = this.users.get(driverId);
        if (!driver || driver.type !== UserType.DRIVER) {
            throw new Error('Invalid driver ID');
        }

        const id = `vehicle_${this.nextId++}`;
        const vehicle = new Vehicle(id, driverId, make, model, year, licensePlate, type, capacity);
        this.vehicles.set(id, vehicle);
        return vehicle;
    }

    getVehicle(vehicleId: string): Vehicle | undefined {
        return this.vehicles.get(vehicleId);
    }

    getDriverVehicles(driverId: string): Vehicle[] {
        return Array.from(this.vehicles.values()).filter(vehicle => vehicle.driverId === driverId);
    }

    updateVehicleAvailability(vehicleId: string, available: boolean): void {
        const vehicle = this.vehicles.get(vehicleId);
        if (vehicle) {
            vehicle.setAvailability(available);
        } else {
            throw new Error('Vehicle not found');
        }
    }

    // Trip Management
    requestTrip(
        riderId: string,
        pickupLatitude: number,
        pickupLongitude: number,
        dropoffLatitude: number,
        dropoffLongitude: number,
        vehicleType: VehicleType = VehicleType.ECONOMY
    ): Trip {
        const rider = this.users.get(riderId);
        if (!rider || rider.type !== UserType.RIDER) {
            throw new Error('Invalid rider ID');
        }

        const id = `trip_${this.nextId++}`;
        const trip = new Trip(
            id,
            riderId,
            { latitude: pickupLatitude, longitude: pickupLongitude },
            { latitude: dropoffLatitude, longitude: dropoffLongitude },
            vehicleType
        );
        this.trips.set(id, trip);
        return trip;
    }

    getTrip(tripId: string): Trip | undefined {
        return this.trips.get(tripId);
    }

    getUserTrips(userId: string): Trip[] {
        return Array.from(this.trips.values()).filter(trip => 
            trip.riderId === userId || trip.driverId === userId
        );
    }

    // Find the nearest available driver for a trip
    findDriver(tripId: string): User | undefined {
        const trip = this.trips.get(tripId);
        if (!trip || trip.status !== TripStatus.REQUESTED) {
            throw new Error('Invalid trip or trip not in REQUESTED state');
        }

        // Find available vehicles of the requested type
        const availableVehicles = Array.from(this.vehicles.values()).filter(
            vehicle => vehicle.available && vehicle.type === trip.vehicleType
        );

        if (availableVehicles.length === 0) {
            return undefined;
        }

        // For simplicity, just pick the first available vehicle
        // In a real system, we would calculate distances and find the nearest driver
        const selectedVehicle = availableVehicles[0];
        const driver = this.users.get(selectedVehicle.driverId);

        if (driver) {
            // Assign the driver to the trip
            trip.assignDriver(driver.id, selectedVehicle.id);
            // Mark the vehicle as unavailable
            selectedVehicle.setAvailability(false);
            return driver;
        }

        return undefined;
    }

    startTrip(tripId: string): void {
        const trip = this.trips.get(tripId);
        if (!trip || trip.status !== TripStatus.DRIVER_ASSIGNED) {
            throw new Error('Invalid trip or trip not in DRIVER_ASSIGNED state');
        }

        trip.startTrip();
    }

    completeTrip(tripId: string): void {
        const trip = this.trips.get(tripId);
        if (!trip || trip.status !== TripStatus.STARTED) {
            throw new Error('Invalid trip or trip not in STARTED state');
        }

        // Calculate fare based on distance (simplified)
        // In a real system, this would be more complex
        const distance = this.calculateDistance(
            trip.pickupLocation.latitude,
            trip.pickupLocation.longitude,
            trip.dropoffLocation.latitude,
            trip.dropoffLocation.longitude
        );

        const baseFare = 5.0; // Base fare in dollars
        const ratePerKm = 2.0; // Rate per kilometer
        const fare = baseFare + (distance * ratePerKm);

        trip.completeTrip(fare, distance);

        // Make the vehicle available again
        if (trip.vehicleId) {
            const vehicle = this.vehicles.get(trip.vehicleId);
            if (vehicle) {
                vehicle.setAvailability(true);
            }
        }

        // Process payment
        if (trip.driverId) {
            this.processPayment(trip.id, trip.riderId, trip.driverId, fare);
        }
    }

    cancelTrip(tripId: string): void {
        const trip = this.trips.get(tripId);
        if (!trip || trip.status === TripStatus.COMPLETED) {
            throw new Error('Invalid trip or trip already completed');
        }

        trip.cancelTrip();

        // Make the vehicle available again if a driver was assigned
        if (trip.vehicleId) {
            const vehicle = this.vehicles.get(trip.vehicleId);
            if (vehicle) {
                vehicle.setAvailability(true);
            }
        }
    }

    rateTrip(tripId: string, rating: number): void {
        const trip = this.trips.get(tripId);
        if (!trip || trip.status !== TripStatus.COMPLETED) {
            throw new Error('Invalid trip or trip not completed');
        }

        trip.rateTrip(rating);

        // Update driver rating
        if (trip.driverId) {
            const driver = this.users.get(trip.driverId);
            if (driver) {
                // In a real system, we would calculate the average rating
                driver.updateRating(rating);
            }
        }
    }

    // Payment Management
    processPayment(tripId: string, riderId: string, driverId: string, amount: number, method: PaymentMethod = PaymentMethod.CREDIT_CARD): Payment {
        const id = `payment_${this.nextId++}`;
        const payment = new Payment(id, tripId, riderId, driverId, amount, method);
        this.payments.set(id, payment);

        // Simulate payment processing
        // In a real system, this would involve a payment gateway
        const transactionId = `txn_${Date.now()}`;
        payment.completePayment(transactionId);

        return payment;
    }

    getPayment(paymentId: string): Payment | undefined {
        return this.payments.get(paymentId);
    }

    getTripPayment(tripId: string): Payment | undefined {
        return Array.from(this.payments.values()).find(payment => payment.tripId === tripId);
    }

    // Helper method to calculate distance between two points (simplified)
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        // Simple Euclidean distance (not accurate for real-world use)
        // In a real system, we would use the Haversine formula or a mapping API
        const latDiff = lat2 - lat1;
        const lonDiff = lon2 - lon1;
        return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // Rough conversion to kilometers
    }
} 