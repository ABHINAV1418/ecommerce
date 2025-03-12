# E-commerce System

A simplified e-commerce system built with TypeScript that demonstrates core e-commerce functionality.

## Features

- **User Management**: Register users, manage user profiles and addresses
- **Product Management**: Add, view, and search products by category or keywords
- **Cart Management**: Add items to cart, update quantities, remove items
- **Order Management**: Create orders, track order status
- **Payment Processing**: Process payments with different payment methods
- **Serviceability**: Check if products can be delivered to specific pincodes

## System Architecture

The system follows a layered architecture:

1. **Models**: Core domain entities (User, Product, Cart, Order)
2. **Services**: Business logic layer
3. **Controllers**: API endpoints for HTTP requests
4. **API Server**: Express server to handle HTTP requests

## Models

- **User**: Manages user information and addresses
- **Product**: Represents products with inventory and serviceability
- **Cart**: Manages shopping cart items
- **Order**: Handles order processing and payment

## API Endpoints

### User Management
- `POST /api/users/register` - Register a new user
- `GET /api/users/:userId` - Get user details
- `POST /api/users/:userId/addresses` - Add a new address for a user

### Product Management
- `POST /api/products` - Add a new product
- `GET /api/products` - Get all products
- `GET /api/products/search` - Search products by query
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:productId` - Get product details
- `PUT /api/products/:productId/inventory` - Update product inventory

### Cart Management
- `GET /api/users/:userId/cart` - Get user's cart
- `POST /api/users/:userId/cart` - Add item to cart
- `DELETE /api/users/:userId/cart/items/:itemId` - Remove item from cart
- `DELETE /api/users/:userId/cart` - Clear cart

### Order Management
- `POST /api/users/:userId/orders` - Create a new order
- `GET /api/users/:userId/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/status` - Update order status

### Payment Management
- `POST /api/payments/:paymentId/process` - Process payment

## Running the Demo

To run the demo:

```bash
npm run demo
```

The demo showcases:
1. Listing available products
2. User information and addresses
3. Adding products to cart
4. Creating an order
5. Processing payment
6. Checking inventory after order
7. Searching for products

## Running the API Server

To start the API server:

```bash
npm run dev
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## Future Enhancements

- User authentication and authorization
- Product reviews and ratings
- Discount and coupon management
- Order tracking and notifications
- Admin dashboard
- Payment gateway integration # ecommerce
