import { UberSystem } from './models/UberSystem';
import { UserType } from './models/User';
import { VehicleType } from './models/Vehicle';
import { TripStatus } from './models/Trip';
import { PaymentMethod } from './models/Payment';

async function runDemo() {
    console.log('=== Uber Demo ===\n');
    
    // Initialize the Uber system
    const uberSystem = new UberSystem();
    console.log('Uber system initialized\n');
    
    // Register users
    console.log('=== Registering Users ===');
    const rider = uberSystem.registerUser('John Doe', 'john@example.com', '1234567890', UserType.RIDER);
    console.log(`Registered rider: ${rider.name} (${rider.id})`);
    
    const driver = uberSystem.registerUser('Jane Smith', 'jane@example.com', '9876543210', UserType.DRIVER);
    console.log(`Registered driver: ${driver.name} (${driver.id})\n`);
    
    // Register a vehicle
    console.log('=== Registering Vehicle ===');
    const vehicle = uberSystem.registerVehicle(
        driver.id,
        'Toyota',
        'Camry',
        2020,
        'ABC123',
        VehicleType.ECONOMY,
        4
    );
    console.log(`Registered vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.id})\n`);
    
    // Update user locations
    console.log('=== Updating User Locations ===');
    uberSystem.updateUserLocation(rider.id, 37.7749, -122.4194); // San Francisco
    console.log(`Updated ${rider.name}'s location to San Francisco`);
    
    uberSystem.updateUserLocation(driver.id, 37.7833, -122.4167); // Near San Francisco
    console.log(`Updated ${driver.name}'s location to near San Francisco\n`);
    
    // Request a trip
    console.log('=== Requesting a Trip ===');
    const trip = uberSystem.requestTrip(
        rider.id,
        37.7749, -122.4194, // Pickup at San Francisco
        37.3352, -121.8811, // Dropoff at San Jose
        VehicleType.ECONOMY
    );
    console.log(`Trip requested: ${trip.id}`);
    console.log(`Pickup: (${trip.pickupLocation.latitude}, ${trip.pickupLocation.longitude})`);
    console.log(`Dropoff: (${trip.dropoffLocation.latitude}, ${trip.dropoffLocation.longitude})`);
    console.log(`Status: ${trip.status}\n`);
    
    // Find a driver
    console.log('=== Finding a Driver ===');
    const assignedDriver = uberSystem.findDriver(trip.id);
    if (assignedDriver) {
        console.log(`Driver assigned: ${assignedDriver.name} (${assignedDriver.id})`);
        console.log(`Trip status: ${trip.status}\n`);
    } else {
        console.log('No driver found\n');
        return;
    }
    
    // Start the trip
    console.log('=== Starting the Trip ===');
    uberSystem.startTrip(trip.id);
    console.log(`Trip started at ${trip.startTime?.toLocaleTimeString()}`);
    console.log(`Trip status: ${trip.status}\n`);
    
    // Complete the trip
    console.log('=== Completing the Trip ===');
    uberSystem.completeTrip(trip.id);
    console.log(`Trip completed at ${trip.endTime?.toLocaleTimeString()}`);
    console.log(`Trip status: ${trip.status}`);
    console.log(`Trip distance: ${trip.distance?.toFixed(2)} km`);
    console.log(`Trip fare: $${trip.fare?.toFixed(2)}\n`);
    
    // Get payment details
    console.log('=== Payment Details ===');
    const payment = uberSystem.getTripPayment(trip.id);
    if (payment) {
        console.log(`Payment ID: ${payment.id}`);
        console.log(`Amount: $${payment.amount.toFixed(2)}`);
        console.log(`Status: ${payment.status}`);
        console.log(`Method: ${payment.method}`);
        console.log(`Transaction ID: ${payment.transactionId}\n`);
    }
    
    // Rate the trip
    console.log('=== Rating the Trip ===');
    uberSystem.rateTrip(trip.id, 5);
    console.log(`Trip rated: ${trip.rating} stars\n`);
    
    // Get user trips
    console.log('=== User Trip History ===');
    const riderTrips = uberSystem.getUserTrips(rider.id);
    console.log(`${rider.name} has ${riderTrips.length} trips:`);
    riderTrips.forEach(t => {
        console.log(`- Trip ${t.id}: ${t.status}, Fare: $${t.fare?.toFixed(2)}`);
    });
    
    const driverTrips = uberSystem.getUserTrips(driver.id);
    console.log(`\n${driver.name} has ${driverTrips.length} trips:`);
    driverTrips.forEach(t => {
        console.log(`- Trip ${t.id}: ${t.status}, Fare: $${t.fare?.toFixed(2)}`);
    });
    
    console.log('\n=== Demo Completed ===');
}

// Run the demo
runDemo().catch(error => {
    console.error('Demo failed with error:', error);
}); 