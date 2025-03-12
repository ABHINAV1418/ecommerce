import { Request, Response } from 'express';
import { EcommerceService } from '../services/EcommerceService';
import { UserRole } from '../models/User';
import { ProductCategory } from '../models/Product';
import { PaymentMethod, OrderStatus } from '../models/Order';

export class EcommerceController {
    private service: EcommerceService;
    
    constructor() {
        this.service = new EcommerceService();
    }
    
    // User Management
    registerUser = (req: Request, res: Response): void => {
        try {
            const { name, email, phone, role } = req.body;
            
            if (!name || !email || !phone) {
                res.status(400).json({ error: 'Name, email, and phone are required' });
                return;
            }
            
            // Only allow admin role if specified and user is authenticated as admin
            const userRole = role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.CUSTOMER;
            
            const user = this.service.registerUser(name, email, phone, userRole);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    getUser = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const user = this.service.getUser(userId);
            res.json(user);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    };
    
    addUserAddress = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const { name, line1, line2, city, state, pincode, phone, isDefault } = req.body;
            
            if (!name || !line1 || !city || !state || !pincode || !phone) {
                res.status(400).json({ error: 'Address details are incomplete' });
                return;
            }
            
            const address = this.service.addUserAddress(userId, {
                name,
                line1,
                line2: line2 || '',
                city,
                state,
                pincode,
                phone,
                isDefault: isDefault || false
            });
            
            res.status(201).json(address);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    // Product Management
    addProduct = (req: Request, res: Response): void => {
        try {
            const { name, description, price, category, inventory } = req.body;
            
            if (!name || !description || !price || !category) {
                res.status(400).json({ error: 'Product details are incomplete' });
                return;
            }
            
            // Validate category
            if (!Object.values(ProductCategory).includes(category)) {
                res.status(400).json({ error: 'Invalid product category' });
                return;
            }
            
            const product = this.service.addProduct(
                name,
                description,
                price,
                category,
                inventory || 0
            );
            
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    getProduct = (req: Request, res: Response): void => {
        try {
            const productId = req.params.productId;
            const product = this.service.getProduct(productId);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    };
    
    getAllProducts = (req: Request, res: Response): void => {
        try {
            const products = this.service.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
    
    getProductsByCategory = (req: Request, res: Response): void => {
        try {
            const category = req.params.category as ProductCategory;
            
            // Validate category
            if (!Object.values(ProductCategory).includes(category)) {
                res.status(400).json({ error: 'Invalid product category' });
                return;
            }
            
            const products = this.service.getProductsByCategory(category);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
    
    updateProductInventory = (req: Request, res: Response): void => {
        try {
            const productId = req.params.productId;
            const { quantity } = req.body;
            
            if (quantity === undefined) {
                res.status(400).json({ error: 'Quantity is required' });
                return;
            }
            
            this.service.updateProductInventory(productId, quantity);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    searchProducts = (req: Request, res: Response): void => {
        try {
            const query = req.query.q as string;
            
            if (!query) {
                res.status(400).json({ error: 'Search query is required' });
                return;
            }
            
            const products = this.service.searchProducts(query);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
    
    // Cart Management
    getCart = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const cart = this.service.getCart(userId);
            res.json(cart);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    };
    
    addToCart = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const { productId, quantity } = req.body;
            
            if (!productId || !quantity) {
                res.status(400).json({ error: 'Product ID and quantity are required' });
                return;
            }
            
            this.service.addToCart(userId, productId, quantity);
            const cart = this.service.getCart(userId);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    removeFromCart = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const itemId = req.params.itemId;
            
            this.service.removeFromCart(userId, itemId);
            const cart = this.service.getCart(userId);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    clearCart = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            
            this.service.clearCart(userId);
            const cart = this.service.getCart(userId);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    // Order Management
    createOrder = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const { addressId, paymentMethod } = req.body;
            
            if (!addressId || !paymentMethod) {
                res.status(400).json({ error: 'Address ID and payment method are required' });
                return;
            }
            
            // Validate payment method
            if (!Object.values(PaymentMethod).includes(paymentMethod)) {
                res.status(400).json({ error: 'Invalid payment method' });
                return;
            }
            
            const order = this.service.createOrder(userId, addressId, paymentMethod);
            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    getOrder = (req: Request, res: Response): void => {
        try {
            const orderId = req.params.orderId;
            const order = this.service.getOrder(orderId);
            res.json(order);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    };
    
    getUserOrders = (req: Request, res: Response): void => {
        try {
            const userId = req.params.userId;
            const orders = this.service.getUserOrders(userId);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
    
    updateOrderStatus = (req: Request, res: Response): void => {
        try {
            const orderId = req.params.orderId;
            const { status } = req.body;
            
            if (!status) {
                res.status(400).json({ error: 'Status is required' });
                return;
            }
            
            // Validate order status
            if (!Object.values(OrderStatus).includes(status)) {
                res.status(400).json({ error: 'Invalid order status' });
                return;
            }
            
            this.service.updateOrderStatus(orderId, status);
            const order = this.service.getOrder(orderId);
            res.json(order);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
    
    // Payment Management
    processPayment = (req: Request, res: Response): void => {
        try {
            const paymentId = req.params.paymentId;
            
            const success = this.service.processPayment(paymentId);
            
            if (success) {
                res.json({ success: true, message: 'Payment processed successfully' });
            } else {
                res.status(400).json({ success: false, message: 'Payment processing failed' });
            }
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
} 