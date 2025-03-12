import { v4 as uuidv4 } from 'uuid';

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN'
}

export class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    addresses: Address[];
    
    constructor(
        name: string,
        email: string,
        phone: string,
        role: UserRole = UserRole.CUSTOMER
    ) {
        this.id = uuidv4();
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.addresses = [];
    }
    
    addAddress(address: Address): void {
        this.addresses.push(address);
    }
    
    removeAddress(addressId: string): void {
        this.addresses = this.addresses.filter(addr => addr.id !== addressId);
    }
    
    getDefaultAddress(): Address | undefined {
        return this.addresses.find(addr => addr.isDefault);
    }
    
    setDefaultAddress(addressId: string): void {
        this.addresses.forEach(addr => {
            addr.isDefault = addr.id === addressId;
        });
    }
}

export class Address {
    id: string;
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
    
    constructor(
        id: string = uuidv4(),
        name: string,
        line1: string,
        line2: string = '',
        city: string,
        state: string,
        pincode: string,
        phone: string,
        isDefault: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.line1 = line1;
        this.line2 = line2;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.phone = phone;
        this.isDefault = isDefault;
    }
} 