# Order Management System

This is a simple Order Management System for an e-commerce platform, focusing on inventory management and order processing.

## Features

The implementation provides the following APIs:

1. `addProduct(productId, quantity)` - Add a product or update its quantity
2. `createOrder(orderId, items)` - Create a new order with a list of products and quantities
3. `confirmOrder(orderId)` - Confirm an order and reduce stock
4. `getStock(productId)` - Get the current stock of a product

## Project Structure

```
orderManagementSystem/
├── src/
│   ├── models/
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── OrderItem.ts
│   ├── services/
│   │   └── OrderManagementService.ts
│   ├── controllers/
│   │   └── OrderManagementController.ts
│   ├── index.ts
│   └── demo.ts
├── package.json
├── tsconfig.json
└── README.md
```

## How to Run

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Running the Demo

```bash
# Run the demo script
npm run demo
```

### Running the API Server

```bash
# Start the server
npm run dev
```

The server will start on http://localhost:3000.

## API Endpoints

### Products

- `POST /api/products` - Add a product
  - Body: `{ "productId": string, "quantity": number }`

- `GET /api/products` - Get all products

- `GET /api/products/:productId/stock` - Get the stock of a product

### Orders

- `POST /api/orders` - Create an order
  - Body: `{ "orderId": string, "items": [{ "productId": string, "quantity": number }] }`

- `GET /api/orders` - Get all orders

- `GET /api/orders/:orderId` - Get an order by ID

- `POST /api/orders/:orderId/confirm` - Confirm an order

## Interview Demonstration

For an interview setting, you can use the `demo.ts` file to showcase the functionality without needing to set up HTTP requests. This file demonstrates all the required APIs in a clear, sequential manner.

To run the demo:

```bash
npm run demo
```

This will output a step-by-step demonstration of all the APIs working together.
