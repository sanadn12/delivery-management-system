# Delivery Backend API

This is an Express.js-based backend API for managing deliveries, assignments, and delivery partners. It is built with TypeScript and uses PostgreSQL as the database.

## Features
- Delivery Partner Management
- Order Management
- Assignment Management
- PostgreSQL Database Integration
- Environment Variables Configuration
- Docker Support

## Project Structure
```
backend/
│── dist/               # Compiled TypeScript files
│── node_modules/       # Dependencies
│── src/
│   ├── config/
│   │   ├── db.ts      # Database connection
│   ├── controllers/   # Business logic
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── index.ts       # Main entry point
│── .env               # Environment variables
│── Dockerfile         # Docker configuration
│── package.json       # Dependencies and scripts
│── tsconfig.json      # TypeScript configuration
```

## Prerequisites
- Node.js (Latest LTS version recommended)
- PostgreSQL
- Docker (Optional, for containerized deployment)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sanadn12/delivery-management-system.git
   cd delivery-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following:
   ```env
   DATABASE_URL=your_postgres_connection_string
   PORT=5000
   ```

## Running the Project
### Development Mode
```sh
npm run dev
```
### Production Mode
1. Build the project:
   ```sh
   npm run build
   ```
2. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
### Delivery Partner Routes
- `GET /api/delivery-partners` - Get all delivery partners
- `POST /api/delivery-partners` - Add a new delivery partner

### Order Routes
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order

### Assignment Routes
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Assign an order to a delivery partner

## Docker Setup (Optional)
1. Build the Docker image:
   ```sh
   docker build -t delivery-backend .
   ```
2. Run the container:
   ```sh
   docker run -p 5000:5000 --env-file .env delivery-backend
   ```

## License
This project is licensed under the MIT License.

