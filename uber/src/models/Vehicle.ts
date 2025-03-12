export enum VehicleType {
    ECONOMY = 'ECONOMY',
    PREMIUM = 'PREMIUM',
    SUV = 'SUV'
}

export class Vehicle {
    id: string;
    driverId: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    type: VehicleType;
    capacity: number;
    available: boolean;

    constructor(
        id: string,
        driverId: string,
        make: string,
        model: string,
        year: number,
        licensePlate: string,
        type: VehicleType = VehicleType.ECONOMY,
        capacity: number = 4
    ) {
        this.id = id;
        this.driverId = driverId;
        this.make = make;
        this.model = model;
        this.year = year;
        this.licensePlate = licensePlate;
        this.type = type;
        this.capacity = capacity;
        this.available = true;
    }

    setAvailability(available: boolean): void {
        this.available = available;
    }
} 