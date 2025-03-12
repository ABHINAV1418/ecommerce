import { EcommerceSystem } from '../models/EcommerceSystem';
import { User, Address, UserRole } from '../models/User';
import { Product, ProductCategory } from '../models/Product';
import { Cart } from '../models/Cart';
import { Order, OrderStatus, PaymentMethod } from '../models/Order';

export class EcommerceService {
    private system: EcommerceSystem;
    
    constructor() {
        this.system = new EcommerceSystem();
        this.initializeDemo();
    }
    
    // Initialize with demo data
    private initializeDemo(): void {
        try {
            // Create admin user
            this.registerUser('Admin User', 'admin@example.com', '9999999999', UserRole.ADMIN);
            
            // Create some regular users
            const user1 = this.registerUser('John Doe', 'john@example.com', '8888888888');
            const user2 = this.registerUser('Jane Smith', 'jane@example.com', '7777777777');
            
            // Add addresses
            this.addUserAddress(user1.id, {
                name: 'John Doe',
                line1: '123 Main St',
                line2: 'Apt 4B',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                phone: '8888888888',
                isDefault: true
            });
            
            this.addUserAddress(user2.id, {
                name: 'Jane Smith',
                line1: '456 Park Ave',
                line2: '',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560001',
                phone: '7777777777',
                isDefault: true
            });
            
            // Add products
            const phone = this.addProduct(
                'Smartphone X',
                'Latest smartphone with advanced features',
                49999,
                ProductCategory.ELECTRONICS,
                100
            );
            
            const laptop = this.addProduct(
                'Laptop Pro',
                'High-performance laptop for professionals',
                89999,
                ProductCategory.ELECTRONICS,
                50
            );
            
            const tshirt = this.addProduct(
                'Cotton T-Shirt',
                'Comfortable cotton t-shirt',
                999,
                ProductCategory.CLOTHING,
                200
            );
            
            const book = this.addProduct(
                'Design Patterns',
                'Book on software design patterns',
                599,
                ProductCategory.BOOKS,
                75
            );
            
            // Add product images
            phone.addImage('https://example.com/images/smartphone.jpg');
            laptop.addImage('https://example.com/images/laptop.jpg');
            tshirt.addImage('https://example.com/images/tshirt.jpg');
            book.addImage('https://example.com/images/book.jpg');
            
            // Add product ratings
            phone.addRating(4.5);
            phone.addRating(5);
            laptop.addRating(4);
            tshirt.addRating(3.5);
            book.addRating(4.8);
            
            console.log('Demo data initialized successfully');
        } catch (error) {
            console.error('Error initializing demo data:', error);
        }
    }
    
    // User Management
    registerUser(name: string, email: string, phone: string, role: UserRole = UserRole.CUSTOMER): User {
        return this.system.registerUser(name, email, phone, role);
    }
    
    getUser(userId: string): User {
        return this.system.getUser(userId);
    }
    
    getUserByEmail(email: string): User | undefined {
        return this.system.getUserByEmail(email);
    }
    
    addUserAddress(userId: string, addressData: Omit<Address, 'id'>): Address {
        const address: Address = {
            id: Date.now().toString(),
            ...addressData
        };
        
        this.system.addUserAddress(userId, address);
        return address;
    }
    
    // Product Management
    addProduct(
        name: string,
        description: string,
        price: number,
        category: ProductCategory,
        inventory: number = 0
    ): Product {
        return this.system.addProduct(name, description, price, category, inventory);
    }
    
    getProduct(productId: string): Product {
        return this.system.getProduct(productId);
    }
    
    getAllProducts(): Product[] {
        return this.system.getAllProducts();
    }
    
    getProductsByCategory(category: ProductCategory): Product[] {
        return this.system.getProductsByCategory(category);
    }
    
    updateProductInventory(productId: string, quantity: number): void {
        this.system.updateProductInventory(productId, quantity);
    }
    
    // Pincode Management
    addServiceablePincode(pincode: string): void {
        this.system.addServiceablePincode(pincode);
    }
    
    removeServiceablePincode(pincode: string): void {
        this.system.removeServiceablePincode(pincode);
    }
    
    isPincodeServiceable(pincode: string): boolean {
        return this.system.isPincodeServiceable(pincode);
    }
    
    addProductServiceablePincode(productId: string, pincode: string): void {
        this.system.addProductServiceablePincode(productId, pincode);
    }
    
    isProductServiceableAtPincode(productId: string, pincode: string): boolean {
        return this.system.isProductServiceableAtPincode(productId, pincode);
    }
    
    // Cart Management
    getCart(userId: string): Cart {
        return this.system.getCart(userId);
    }
    
    addToCart(userId: string, productId: string, quantity: number): void {
        this.system.addToCart(userId, productId, quantity);
    }
    
    removeFromCart(userId: string, itemId: string): void {
        this.system.removeFromCart(userId, itemId);
    }
    
    clearCart(userId: string): void {
        this.system.clearCart(userId);
    }
    
    // Order Management
    createOrder(userId: string, addressId: string, paymentMethod: PaymentMethod): Order {
        return this.system.createOrder(userId, addressId, paymentMethod);
    }
    
    getOrder(orderId: string): Order {
        return this.system.getOrder(orderId);
    }
    
    getUserOrders(userId: string): Order[] {
        return this.system.getUserOrders(userId);
    }
    
    updateOrderStatus(orderId: string, status: OrderStatus): void {
        this.system.updateOrderStatus(orderId, status);
    }
    
    // Payment Management
    processPayment(paymentId: string): boolean {
        return this.system.processPayment(paymentId);
    }
    
    // Search functionality
    searchProducts(query: string): Product[] {
        query = query.toLowerCase();
        return this.system.getAllProducts().filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
    }
} 