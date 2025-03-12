import { Request, Response } from 'express';
import { VendingMachineService } from '../services/VendingMachineService';
import { CoinType } from '../models/Coin';

export class VendingMachineController {
    private vendingMachineService: VendingMachineService;
    
    constructor(vendingMachineService: VendingMachineService) {
        this.vendingMachineService = vendingMachineService;
    }
    
    /**
     * Get all products
     */
    getAllProducts = (req: Request, res: Response): void => {
        try {
            const products = this.vendingMachineService.getAllProducts();
            
            res.status(200).json({
                products
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    /**
     * Get a product by ID
     */
    getProduct = (req: Request, res: Response): void => {
        try {
            const { productId } = req.params;
            
            if (!productId) {
                res.status(400).json({ error: 'Product ID is required' });
                return;
            }
            
            const product = this.vendingMachineService.getProduct(productId);
            
            if (!product) {
                res.status(404).json({ error: `Product with ID ${productId} not found` });
                return;
            }
            
            res.status(200).json({
                product
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    /**
     * Select a product
     */
    selectProduct = (req: Request, res: Response): void => {
        try {
            const { productId } = req.body;
            
            if (!productId) {
                res.status(400).json({ error: 'Product ID is required' });
                return;
            }
            
            this.vendingMachineService.selectProduct(productId);
            
            res.status(200).json({
                message: `Product ${productId} selected`,
                state: this.vendingMachineService.getCurrentState(),
                balance: this.vendingMachineService.getCurrentBalance()
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Insert a coin
     */
    insertCoin = (req: Request, res: Response): void => {
        try {
            const { coinType } = req.body;
            
            if (coinType === undefined) {
                res.status(400).json({ error: 'Coin type is required' });
                return;
            }
            
            // Convert string to CoinType enum
            let coinTypeEnum: CoinType;
            
            switch (coinType) {
                case 'PENNY':
                    coinTypeEnum = CoinType.PENNY;
                    break;
                case 'NICKEL':
                    coinTypeEnum = CoinType.NICKEL;
                    break;
                case 'DIME':
                    coinTypeEnum = CoinType.DIME;
                    break;
                case 'QUARTER':
                    coinTypeEnum = CoinType.QUARTER;
                    break;
                default:
                    res.status(400).json({ error: 'Invalid coin type' });
                    return;
            }
            
            this.vendingMachineService.insertCoin(coinTypeEnum);
            
            res.status(200).json({
                message: `${coinType} inserted`,
                state: this.vendingMachineService.getCurrentState(),
                balance: this.vendingMachineService.getCurrentBalance()
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Dispense the selected product
     */
    dispenseProduct = (req: Request, res: Response): void => {
        try {
            const product = this.vendingMachineService.dispenseProduct();
            
            res.status(200).json({
                message: `Product ${product.name} dispensed`,
                product,
                state: this.vendingMachineService.getCurrentState(),
                balance: this.vendingMachineService.getCurrentBalance()
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Return change
     */
    returnChange = (req: Request, res: Response): void => {
        try {
            const change = this.vendingMachineService.returnChange();
            
            res.status(200).json({
                message: `Change returned: ${change.total} cents`,
                coins: change.coins.map(coin => coin.getName()),
                total: change.total,
                state: this.vendingMachineService.getCurrentState(),
                balance: this.vendingMachineService.getCurrentBalance()
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Cancel the current transaction
     */
    cancelTransaction = (req: Request, res: Response): void => {
        try {
            const change = this.vendingMachineService.cancelTransaction();
            
            res.status(200).json({
                message: `Transaction cancelled. Change returned: ${change.total} cents`,
                coins: change.coins.map(coin => coin.getName()),
                total: change.total,
                state: this.vendingMachineService.getCurrentState(),
                balance: this.vendingMachineService.getCurrentBalance()
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Restock a product
     */
    restockProduct = (req: Request, res: Response): void => {
        try {
            const { productId, quantity } = req.body;
            
            if (!productId || quantity === undefined) {
                res.status(400).json({ error: 'Product ID and quantity are required' });
                return;
            }
            
            const parsedQuantity = parseInt(quantity);
            
            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
                res.status(400).json({ error: 'Quantity must be a positive number' });
                return;
            }
            
            this.vendingMachineService.restockProduct(productId, parsedQuantity);
            
            res.status(200).json({
                message: `Product ${productId} restocked with ${parsedQuantity} units`
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Restock coins
     */
    restockCoins = (req: Request, res: Response): void => {
        try {
            const { coinType, quantity } = req.body;
            
            if (coinType === undefined || quantity === undefined) {
                res.status(400).json({ error: 'Coin type and quantity are required' });
                return;
            }
            
            const parsedQuantity = parseInt(quantity);
            
            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
                res.status(400).json({ error: 'Quantity must be a positive number' });
                return;
            }
            
            // Convert string to CoinType enum
            let coinTypeEnum: CoinType;
            
            switch (coinType) {
                case 'PENNY':
                    coinTypeEnum = CoinType.PENNY;
                    break;
                case 'NICKEL':
                    coinTypeEnum = CoinType.NICKEL;
                    break;
                case 'DIME':
                    coinTypeEnum = CoinType.DIME;
                    break;
                case 'QUARTER':
                    coinTypeEnum = CoinType.QUARTER;
                    break;
                default:
                    res.status(400).json({ error: 'Invalid coin type' });
                    return;
            }
            
            this.vendingMachineService.restockCoins(coinTypeEnum, parsedQuantity);
            
            res.status(200).json({
                message: `${coinType} restocked with ${parsedQuantity} units`
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
    
    /**
     * Get the current state
     */
    getState = (req: Request, res: Response): void => {
        try {
            const state = this.vendingMachineService.getCurrentState();
            const balance = this.vendingMachineService.getCurrentBalance();
            const selectedProductId = this.vendingMachineService.getSelectedProductId();
            
            res.status(200).json({
                state,
                balance,
                selectedProductId
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    /**
     * Get the coin inventory
     */
    getCoinInventory = (req: Request, res: Response): void => {
        try {
            const inventory = this.vendingMachineService.getCoinInventoryArray();
            
            res.status(200).json({
                inventory
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
} 