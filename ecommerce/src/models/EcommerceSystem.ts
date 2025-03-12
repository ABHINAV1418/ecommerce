import { User, Address, UserRole } from './User';
import { Product, ProductCategory } from './Product';
import { Cart } from './Cart';
import { Order, OrderStatus, Payment, PaymentMethod, PaymentStatus } from './Order';
import { v4 as uuidv4 } from 'uuid';

export class EcommerceSystem {
    private users: Map<string, User>;
    private products: Map<string, Product>;
    private carts: Map<string, Cart>;
    private orders: Map<string, Order>;
    private payments: Map<string, Payment>;
    private serviceablePincodes: Set<string>;
    
    constructor() {
        this.users = new Map<string, User>();
        this.products = new Map<string, Product>();
        this.carts = new Map<string, Cart>();
        this.orders = new Map<string, Order>();
        this.payments = new Map<string, Payment>();
        this.serviceablePincodes = new Set<string>();
        
        // Initialize with some serviceable pincodes
        this.addServiceablePincode('110001'); // Delhi
        this.addServiceablePincode('400001'); // Mumbai
        this.addServiceablePincode('700001'); // Kolkata
        this.addServiceablePincode('600001'); // Chennai
        this.addServiceablePincode('560001'); // Bangalore
    }
    
    // User Management
    registerUser(name: string, email: string, phone: string, role: UserRole = UserRole.CUSTOMER): User {
        // Check if email already exists
        const existingUser = Array.from(this.users.values()).find(user => user.email === email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        
        const user = new User(name, email, phone, role);
        this.users.set(user.id, user);
        
        // Create a cart for the user
        this.createCart(user.id);
        
        return user;
    }
    
    getUser(userId: string): User {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    
    getUserByEmail(email: string): User | undefined {
        return Array.from(this.users.values()).find(user => user.email === email);
    }
    
    addUserAddress(userId: string, address: Address): void {
        const user = this.getUser(userId);
        user.addAddress(address);
    }
    
    // Product Management
    addProduct(
        name: string,
        description: string,
        price: number,
        category: ProductCategory,
        inventory: number = 0
    ): Product {
        const product = new Product(name, description, price, category, inventory);
        this.products.set(product.id, product);
        return product;
    }
    
    getProduct(productId: string): Product {
        const product = this.products.get(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    
    getAllProducts(): Product[] {
        return Array.from(this.products.values());
    }
    
    getProductsByCategory(category: ProductCategory): Product[] {
        return Array.from(this.products.values()).filter(product => product.category === category);
    }
    
    updateProductInventory(productId: string, quantity: number): void {
        const product = this.getProduct(productId);
        product.updateInventory(quantity);
    }
    
    isProductInStock(productId: string): boolean {
        const product = this.getProduct(productId);
        return product.isInStock();
    }
    
    // Pincode Management
    addServiceablePincode(pincode: string): void {
        this.serviceablePincodes.add(pincode);
    }
    
    removeServiceablePincode(pincode: string): void {
        this.serviceablePincodes.delete(pincode);
    }
    
    isPincodeServiceable(pincode: string): boolean {
        return this.serviceablePincodes.has(pincode);
    }
    
    addProductServiceablePincode(productId: string, pincode: string): void {
        const product = this.getProduct(productId);
        product.addServiceablePincode(pincode);
    }
    
    isProductServiceableAtPincode(productId: string, pincode: string): boolean {
        const product = this.getProduct(productId);
        
        // Check if the pincode is serviceable by the system
        if (!this.isPincodeServiceable(pincode)) {
            return false;
        }
        
        // If the product has specific serviceable pincodes, check those
        if (product.serviceablePincodes.size > 0) {
            return product.isServiceableAt(pincode);
        }
        
        // If the product doesn't have specific pincodes, it's serviceable at all system pincodes
        return true;
    }
    
    // Cart Management
    createCart(userId: string): Cart {
        const cart = new Cart(userId);
        this.carts.set(userId, cart);
        return cart;
    }
    
    getCart(userId: string): Cart {
        const cart = this.carts.get(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        return cart;
    }
    
    addToCart(userId: string, productId: string, quantity: number): void {
        const cart = this.getCart(userId);
        const product = this.getProduct(productId);
        
        // Check if product is in stock
        if (!product.isInStock()) {
            throw new Error('Product is out of stock');
        }
        
        // Check if we have enough inventory
        if (product.inventory < quantity) {
            throw new Error(`Only ${product.inventory} units available`);
        }
        
        cart.addItem(productId, quantity, product.price);
    }
    
    removeFromCart(userId: string, itemId: string): void {
        const cart = this.getCart(userId);
        const removed = cart.removeItem(itemId);
        
        if (!removed) {
            throw new Error('Item not found in cart');
        }
    }
    
    clearCart(userId: string): void {
        const cart = this.getCart(userId);
        cart.clear();
    }
    
    // Order Management
    createOrder(userId: string, addressId: string, paymentMethod: PaymentMethod): Order {
        const user = this.getUser(userId);
        const cart = this.getCart(userId);
        
        // Check if cart is empty
        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }
        
        // Find the shipping address
        const address = user.addresses.find(addr => addr.id === addressId);
        if (!address) {
            throw new Error('Address not found');
        }
        
        // Check if all products are in stock and serviceable at the address pincode
        for (const item of cart.items) {
            const product = this.getProduct(item.productId);
            
            // Check inventory
            if (product.inventory < item.quantity) {
                throw new Error(`Only ${product.inventory} units of ${product.name} available`);
            }
            
            // Check serviceability
            if (!this.isProductServiceableAtPincode(product.id, address.pincode)) {
                throw new Error(`${product.name} is not serviceable at pincode ${address.pincode}`);
            }
        }
        
        // Create the order
        const order = new Order(userId, cart.items, address);
        
        // Update product names and reduce inventory
        for (const item of order.items) {
            const product = this.getProduct(item.productId);
            item.productName = product.name;
            product.removeInventory(item.quantity);
        }
        
        // Create payment
        const payment = order.createPayment(paymentMethod);
        this.payments.set(payment.id, payment);
        
        // Save the order
        this.orders.set(order.id, order);
        
        // Clear the cart
        cart.clear();
        
        return order;
    }
    
    getOrder(orderId: string): Order {
        const order = this.orders.get(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }
    
    getUserOrders(userId: string): Order[] {
        return Array.from(this.orders.values()).filter(order => order.userId === userId);
    }
    
    updateOrderStatus(orderId: string, status: OrderStatus): void {
        const order = this.getOrder(orderId);
        order.updateStatus(status);
    }
    
    // Payment Management
    processPayment(paymentId: string): boolean {
        const payment = this.payments.get(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        
        // In a real system, this would involve a payment gateway
        // For simplicity, we'll just simulate a successful payment
        const transactionId = `txn_${Date.now()}`;
        payment.complete(transactionId);
        
        // Update the order status
        const order = this.getOrder(payment.orderId);
        order.updateStatus(OrderStatus.CONFIRMED);
        
        return true;
    }
    
    getPayment(paymentId: string): Payment {
        const payment = this.payments.get(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    }
} 