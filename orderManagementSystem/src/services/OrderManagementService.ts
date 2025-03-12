import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

export class OrderManagementService {
    private products: Map<string, Product>;
    private orders: Map<string, Order>;
    
    constructor() {
        this.products = new Map<string, Product>();
        this.orders = new Map<string, Order>();
    }
    
    /**
     * Add a product or update its quantity
     * @param productId Product ID
     * @param quantity Quantity to add
     */
    addProduct(productId: string, quantity: number): void {
        if (quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }
        
        if (this.products.has(productId)) {
            // Product exists, update quantity
            const product = this.products.get(productId)!;
            product.addQuantity(quantity);
        } else {
            // Create new product
            const product = new Product(productId, quantity);
            this.products.set(productId, product);
        }
    }
    
    /**
     * Create a new order
     * @param orderId Order ID
     * @param items List of items (product ID and quantity)
     */
    createOrder(orderId: string, items: { productId: string, quantity: number }[]): Order {
        // Check if order ID already exists
        if (this.orders.has(orderId)) {
            throw new Error(`Order with ID ${orderId} already exists`);
        }
        
        // Check if all products exist and have sufficient stock
        for (const item of items) {
            const product = this.products.get(item.productId);
            
            if (!product) {
                throw new Error(`Product with ID ${item.productId} does not exist`);
            }
            
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ${item.productId}. Available: ${product.quantity}, Requested: ${item.quantity}`);
            }
        }
        
        // Create order items
        const orderItems = items.map(item => new OrderItem(item.productId, item.quantity));
        
        // Create the order
        const order = new Order(orderId, orderItems);
        this.orders.set(orderId, order);
        
        return order;
    }
    
    /**
     * Confirm an order
     * @param orderId Order ID
     */
    confirmOrder(orderId: string): Order {
        // Check if order exists
        if (!this.orders.has(orderId)) {
            throw new Error(`Order with ID ${orderId} does not exist`);
        }
        
        const order = this.orders.get(orderId)!;
        
        // Check if order is already confirmed
        if (order.isConfirmed()) {
            throw new Error(`Order with ID ${orderId} is already confirmed`);
        }
        
        // Check if order is cancelled
        if (order.isCancelled()) {
            throw new Error(`Order with ID ${orderId} is cancelled and cannot be confirmed`);
        }
        
        // Check if all products have sufficient stock
        for (const item of order.items) {
            const product = this.products.get(item.productId)!;
            
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ${item.productId}. Available: ${product.quantity}, Requested: ${item.quantity}`);
            }
        }
        
        // Reduce stock for all products
        for (const item of order.items) {
            const product = this.products.get(item.productId)!;
            product.removeQuantity(item.quantity);
        }
        
        // Confirm the order
        order.confirm();
        
        return order;
    }
    
    /**
     * Get the stock of a product
     * @param productId Product ID
     */
    getStock(productId: string): number {
        // Check if product exists
        if (!this.products.has(productId)) {
            throw new Error(`Product with ID ${productId} does not exist`);
        }
        
        const product = this.products.get(productId)!;
        return product.quantity;
    }
    
    /**
     * Get all products
     */
    getAllProducts(): Product[] {
        return Array.from(this.products.values());
    }
    
    /**
     * Get all orders
     */
    getAllOrders(): Order[] {
        return Array.from(this.orders.values());
    }
    
    /**
     * Get an order by ID
     * @param orderId Order ID
     */
    getOrder(orderId: string): Order | undefined {
        return this.orders.get(orderId);
    }
} 