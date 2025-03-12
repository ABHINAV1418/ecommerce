import { v4 as uuidv4 } from 'uuid';

export enum UserType {
    RIDER = 'RIDER',
    DRIVER = 'DRIVER'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED'
}

export class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: UserType;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    rating: number;
    homeAddress?: string;
    workAddress?: string;
    paymentMethods: string[]; // IDs of payment methods
    location?: { latitude: number, longitude: number };

    constructor(
        id: string,
        name: string,
        email: string,
        phone: string,
        type: UserType = UserType.RIDER
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.type = type;
        this.status = UserStatus.ACTIVE;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.rating = 5.0; // Default rating
        this.paymentMethods = [];
    }

    updateProfile(
        name?: string,
        email?: string,
        phone?: string,
        homeAddress?: string,
        workAddress?: string
    ): void {
        if (name) this.name = name;
        if (email) this.email = email;
        if (phone) this.phone = phone;
        if (homeAddress) this.homeAddress = homeAddress;
        if (workAddress) this.workAddress = workAddress;
        this.updatedAt = new Date();
    }


    updateStatus(status: UserStatus): void {
        this.status = status;
        this.updatedAt = new Date();
    }

    updateRating(rating: number): void {
        // Ensure rating is between 1 and 5
        this.rating = Math.max(1, Math.min(5, rating));
        this.updatedAt = new Date();
    }

    addPaymentMethod(paymentMethodId: string): void {
        if (!this.paymentMethods.includes(paymentMethodId)) {
            this.paymentMethods.push(paymentMethodId);
            this.updatedAt = new Date();
        }
    }

    removePaymentMethod(paymentMethodId: string): void {
        this.paymentMethods = this.paymentMethods.filter(id => id !== paymentMethodId);
        this.updatedAt = new Date();
    }

    isActive(): boolean {
        return this.status === UserStatus.ACTIVE;
    }

    isDriver(): boolean {
        return this.type === UserType.DRIVER;
    }

    isRider(): boolean {
        return this.type === UserType.RIDER;
    }

    updateLocation(latitude: number, longitude: number): void {
        this.location = { latitude, longitude };
    }
} 