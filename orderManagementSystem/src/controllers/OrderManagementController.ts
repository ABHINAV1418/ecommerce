import { Request, Response } from 'express';
import { OrderManagementService } from '../services/OrderManagementService';

export class OrderManagementController {
    private orderManagementService: OrderManagementService;
    
    constructor(orderManagementService: OrderManagementService) {
        this.orderManagementService = orderManagementService;
    }
    
    /**
     * Add a product or update its quantity
     */
    addProduct = (req: Request, res: Response): void => {
        try {
            const { productId, quantity } = req.body;
            
            if (!productId || quantity === undefined) {
                res.status(400).json({ error: 'Product ID and quantity are required' });
                return;
            }
            
            const parsedQuantity = parseInt(quantity);
            
            if (isNaN(parsedQuantity)) {
                res.status(400).json({ error: 'Quantity must be a number' });
                return;
            }
            
            this.orderManagementService.addProduct(productId, parsedQuantity);
            
            res.status(200).json({ 
                message: 'Product added successfully',
                productId,
                quantity: parsedQuantity
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Create a new order
     */
    createOrder = (req: Request, res: Response): void => {
        try {
            const { orderId, items } = req.body;
            
            if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
                res.status(400).json({ error: 'Order ID and items are required' });
                return;
            }
            
            // Validate items
            for (const item of items) {
                if (!item.productId || item.quantity === undefined) {
                    res.status(400).json({ error: 'Each item must have a product ID and quantity' });
                    return;
                }
                
                const parsedQuantity = parseInt(item.quantity);
                
                if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
                    res.status(400).json({ error: 'Quantity must be a positive number' });
                    return;
                }
                
                // Update the item with parsed quantity
                item.quantity = parsedQuantity;
            }
            
            const order = this.orderManagementService.createOrder(orderId, items);
            
            res.status(201).json({
                message: 'Order created successfully',
                order
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Confirm an order
     */
    confirmOrder = (req: Request, res: Response): void => {
        try {
            const { orderId } = req.params;
            
            if (!orderId) {
                res.status(400).json({ error: 'Order ID is required' });
                return;
            }
            
            const order = this.orderManagementService.confirmOrder(orderId);
            
            res.status(200).json({
                message: 'Order confirmed successfully',
                order
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Get the stock of a product
     */
    getStock = (req: Request, res: Response): void => {
        try {
            const { productId } = req.params;
            
            if (!productId) {
                res.status(400).json({ error: 'Product ID is required' });
                return;
            }
            
            const stock = this.orderManagementService.getStock(productId);
            
            res.status(200).json({
                productId,
                stock
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Get all products
     */
    getAllProducts = (req: Request, res: Response): void => {
        try {
            const products = this.orderManagementService.getAllProducts();
            
            res.status(200).json({
                products
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    /**
     * Get all orders
     */
    getAllOrders = (req: Request, res: Response): void => {
        try {
            const orders = this.orderManagementService.getAllOrders();
            
            res.status(200).json({
                orders
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    /**
     * Get an order by ID
     */
    getOrder = (req: Request, res: Response): void => {
        try {
            const { orderId } = req.params;
            
            if (!orderId) {
                res.status(400).json({ error: 'Order ID is required' });
                return;
            }
            
            const order = this.orderManagementService.getOrder(orderId);
            
            if (!order) {
                res.status(404).json({ error: `Order with ID ${orderId} not found` });
                return;
            }
            
            res.status(200).json({
                order
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
} 