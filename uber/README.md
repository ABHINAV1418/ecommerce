# Uber Application - Low Level Design

A simplified implementation of an Uber-like ride-sharing application built with TypeScript and Express.

## Features

- **User Management**: Register riders and drivers
- **Vehicle Management**: Register and manage vehicles
- **Trip Management**: Request trips, find drivers, start/complete/cancel trips
- **Payment Processing**: Process payments for completed trips
- **Rating System**: Rate trips and update driver ratings

## Project Structure

```
uber/
├── src/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Vehicle.ts
│   │   ├── Trip.ts
│   │   ├── Payment.ts
│   │   └── UberSystem.ts
│   ├── services/
│   │   └── UberService.ts
│   ├── controllers/
│   │   └── UberController.ts
│   ├── index.ts
│   └── demo.ts
├── package.json
└── tsconfig.json
```

## Core Components

### Models

1. **User**: Represents riders and drivers with location tracking
2. **Vehicle**: Represents vehicles with type, capacity, and availability
3. **Trip**: Manages the lifecycle of a trip from request to completion
4. **Payment**: Handles payment processing for completed trips
5. **UberSystem**: Core system that integrates all models and business logic

### Service Layer

- **UberService**: Provides business logic for all operations

### Controller Layer

- **UberController**: Handles HTTP requests and responses

## Installation

1. Clone the repository
2. Install dependencies:

```bash
cd uber
npm install
```

## Usage

### Running the Demo

To run the demo script that showcases the functionality:

```bash
npm run demo
```

The demo will:
- Register riders and drivers
- Register vehicles
- Request trips
- Find and assign drivers
- Start and complete trips
- Process payments
- Rate trips

### Running the API Server

To start the API server:

```bash
npm run dev
```

The server will start on port 3000 (or the port specified in the environment variable).

## API Endpoints

### User Management
- `POST /api/riders` - Register a new rider
- `POST /api/drivers` - Register a new driver
- `GET /api/users/:userId` - Get a specific user
- `PUT /api/users/:userId/location` - Update user location

### Vehicle Management
- `POST /api/vehicles` - Register a new vehicle
- `GET /api/vehicles/:vehicleId` - Get a specific vehicle
- `GET /api/drivers/:driverId/vehicles` - Get all vehicles for a driver
- `PUT /api/vehicles/:vehicleId/availability` - Update vehicle availability

### Trip Management
- `POST /api/trips` - Request a new trip
- `POST /api/trips/:tripId/find-driver` - Find a driver for a trip
- `PUT /api/trips/:tripId/start` - Start a trip
- `PUT /api/trips/:tripId/complete` - Complete a trip
- `PUT /api/trips/:tripId/cancel` - Cancel a trip
- `PUT /api/trips/:tripId/rate` - Rate a trip
- `GET /api/trips/:tripId` - Get a specific trip
- `GET /api/users/:userId/trips` - Get all trips for a user

## License

ISC 