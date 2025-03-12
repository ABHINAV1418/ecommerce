import { v4 as uuidv4 } from 'uuid';

export enum VehicleType {
    MOTORCYCLE = 'MOTORCYCLE',
    CAR = 'CAR',
    BUS = 'BUS',
    TRUCK = 'TRUCK'
}

export enum VehicleSize {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
    EXTRA_LARGE = 'EXTRA_LARGE'
}

export class Vehicle {
    id: string;
    licenseNumber: string;
    type: VehicleType;
    size: VehicleSize;
    
    constructor(licenseNumber: string, type: VehicleType) {
        this.id = uuidv4();
        this.licenseNumber = licenseNumber;
        this.type = type;
        this.size = this.getSizeFromType(type);
    }
    
    private getSizeFromType(type: VehicleType): VehicleSize {
        switch (type) {
            case VehicleType.MOTORCYCLE:
                return VehicleSize.SMALL;
            case VehicleType.CAR:
                return VehicleSize.MEDIUM;
            case VehicleType.BUS:
                return VehicleSize.LARGE;
            case VehicleType.TRUCK:
                return VehicleSize.EXTRA_LARGE;
            default:
                return VehicleSize.MEDIUM;
        }
    }
} 