# Vending Machine

This is a simple Vending Machine implementation that simulates the operations of a real vending machine, including product selection, coin insertion, product dispensing, and change return.

## Features

The implementation provides the following functionality:

1. Product management (add, restock, view)
2. Coin management (insert, return change)
3. Vending machine operations (select product, dispense product, cancel transaction)
4. State management (IDLE, ACCEPTING_COINS, DISPENSING_PRODUCT, RETURNING_CHANGE)

## Project Structure

```
vendingMachine/
├── src/
│   ├── models/
│   │   ├── Product.ts
│   │   ├── Coin.ts
│   │   └── VendingMachine.ts
│   ├── services/
│   │   └── VendingMachineService.ts
│   ├── controllers/
│   │   └── VendingMachineController.ts
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

- `GET /api/products` - Get all products
- `GET /api/products/:productId` - Get a product by ID
- `POST /api/products/restock` - Restock a product
  - Body: `{ "productId": string, "quantity": number }`

### Vending Machine Operations

- `POST /api/select` - Select a product
  - Body: `{ "productId": string }`
- `POST /api/insert-coin` - Insert a coin
  - Body: `{ "coinType": "PENNY" | "NICKEL" | "DIME" | "QUARTER" }`
- `POST /api/dispense` - Dispense the selected product
- `POST /api/return-change` - Return change
- `POST /api/cancel` - Cancel the current transaction

### Admin

- `POST /api/coins/restock` - Restock coins
  - Body: `{ "coinType": "PENNY" | "NICKEL" | "DIME" | "QUARTER", "quantity": number }`
- `GET /api/state` - Get the current state of the vending machine
- `GET /api/coins` - Get the coin inventory

## Vending Machine States

1. **IDLE**: The vending machine is waiting for a product selection
2. **ACCEPTING_COINS**: The vending machine is accepting coins for the selected product
3. **DISPENSING_PRODUCT**: The vending machine is dispensing the selected product
4. **RETURNING_CHANGE**: The vending machine is returning change

## Coin Types

1. **PENNY**: 1 cent
2. **NICKEL**: 5 cents
3. **DIME**: 10 cents
4. **QUARTER**: 25 cents

## Interview Demonstration

For an interview setting, you can use the `demo.ts` file to showcase the functionality without needing to set up HTTP requests. This file demonstrates all the required operations in a clear, sequential manner.

To run the demo:

```bash
npm run demo
```

This will output a step-by-step demonstration of the vending machine operations.
