import { ParkingService } from './services/ParkingService';
import { VehicleType } from './models/Vehicle';
import { ParkingSpotType } from './models/ParkingSpot';
import { TicketStatus } from './models/ParkingTicket';

// Create a parking service
const parkingService = new ParkingService('Downtown Parking', '123 Main St', 3, 10);

// Demo function to showcase all the APIs
function runDemo() {
    console.log('=== Parking Lot System Demo ===');
    console.log('Parking Lot Info:');
    console.log(parkingService.getParkingLotInfo());
    
    console.log('\n=== Available Spots by Type ===');
    console.log('Motorcycle:', parkingService.getAvailableSpotsByType(ParkingSpotType.MOTORCYCLE));
    console.log('Compact:', parkingService.getAvailableSpotsByType(ParkingSpotType.COMPACT));
    console.log('Regular:', parkingService.getAvailableSpotsByType(ParkingSpotType.REGULAR));
    console.log('Large:', parkingService.getAvailableSpotsByType(ParkingSpotType.LARGE));
    
    // Create vehicles
    console.log('\n=== Creating Vehicles ===');
    const motorcycle = parkingService.createVehicle('MC-1234', VehicleType.MOTORCYCLE);
    console.log('Motorcycle:', motorcycle);
    
    const car1 = parkingService.createVehicle('CAR-1234', VehicleType.CAR);
    console.log('Car 1:', car1);
    
    const car2 = parkingService.createVehicle('CAR-5678', VehicleType.CAR);
    console.log('Car 2:', car2);
    
    const bus = parkingService.createVehicle('BUS-1234', VehicleType.BUS);
    console.log('Bus:', bus);
    
    // Park vehicles
    console.log('\n=== Parking Vehicles ===');
    const motorcycleTicket = parkingService.parkVehicle(motorcycle);
    console.log('Motorcycle Ticket:', motorcycleTicket);
    
    const car1Ticket = parkingService.parkVehicle(car1);
    console.log('Car 1 Ticket:', car1Ticket);
    
    const car2Ticket = parkingService.parkVehicle(car2);
    console.log('Car 2 Ticket:', car2Ticket);
    
    const busTicket = parkingService.parkVehicle(bus);
    console.log('Bus Ticket:', busTicket);
    
    // Check available spots after parking
    console.log('\n=== Available Spots After Parking ===');
    console.log('Total Available:', parkingService.getAvailableSpots());
    console.log('Motorcycle:', parkingService.getAvailableSpotsByType(ParkingSpotType.MOTORCYCLE));
    console.log('Compact:', parkingService.getAvailableSpotsByType(ParkingSpotType.COMPACT));
    console.log('Regular:', parkingService.getAvailableSpotsByType(ParkingSpotType.REGULAR));
    console.log('Large:', parkingService.getAvailableSpotsByType(ParkingSpotType.LARGE));
    
    // Get ticket by vehicle
    console.log('\n=== Getting Ticket by Vehicle ===');
    const car1TicketByVehicle = parkingService.getTicketByVehicle(car1.id);
    console.log('Car 1 Ticket by Vehicle:', car1TicketByVehicle);
    
    // Exit a vehicle
    console.log('\n=== Exiting Vehicle (Car 1) ===');
    if (car1Ticket) {
        const exitedTicket = parkingService.exitVehicle(car1Ticket.id);
        console.log('Exited Ticket:', exitedTicket);
        
        // Calculate fee
        console.log('\n=== Calculating Fee ===');
        const fee = parkingService.calculateFee(car1Ticket.id);
        console.log('Fee for Car 1:', fee);
        
        // Process payment
        console.log('\n=== Processing Payment ===');
        const paymentSuccess = parkingService.processPayment(car1Ticket.id);
        console.log('Payment Success:', paymentSuccess);
        
        // Get ticket after payment
        console.log('\n=== Ticket After Payment ===');
        const ticketAfterPayment = parkingService.getTicket(car1Ticket.id);
        console.log('Ticket After Payment:', ticketAfterPayment);
    }
    
    // Report lost ticket
    console.log('\n=== Reporting Lost Ticket (Car 2) ===');
    if (car2Ticket) {
        const lostTicketSuccess = parkingService.reportLostTicket(car2.id);
        console.log('Lost Ticket Success:', lostTicketSuccess);
        
        // Get ticket after reporting lost
        console.log('\n=== Ticket After Reporting Lost ===');
        const ticketAfterLost = parkingService.getTicket(car2Ticket.id);
        console.log('Ticket After Reporting Lost:', ticketAfterLost);
        
        // Calculate fee for lost ticket
        console.log('\n=== Calculating Fee for Lost Ticket ===');
        const lostFee = parkingService.calculateFee(car2Ticket.id);
        console.log('Fee for Lost Ticket:', lostFee);
    }
    
    // Check available spots after some vehicles have left
    console.log('\n=== Available Spots After Some Vehicles Left ===');
    console.log('Total Available:', parkingService.getAvailableSpots());
    console.log('Motorcycle:', parkingService.getAvailableSpotsByType(ParkingSpotType.MOTORCYCLE));
    console.log('Compact:', parkingService.getAvailableSpotsByType(ParkingSpotType.COMPACT));
    console.log('Regular:', parkingService.getAvailableSpotsByType(ParkingSpotType.REGULAR));
    console.log('Large:', parkingService.getAvailableSpotsByType(ParkingSpotType.LARGE));
    
    console.log('\n=== Demo Completed ===');
}

// Run the demo
runDemo(); 