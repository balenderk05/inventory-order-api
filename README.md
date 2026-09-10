# Inventory & Order API

A simple REST API for managing products, inventory, users, and orders.

Built as a backend technical assessment using Node.js, Express.js, MongoDB, JWT authentication, and Zod validation.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod
- Helmet
- CORS
- Nodemon

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Secure password hashing using bcrypt
- Protected routes using authentication middleware

### Products

- Create product
- Get all products
- Get product by ID
- Update product
- Soft delete product
- Search products by name
- Filter products by category
- Filter products by stock availability
- Pagination

### Orders

- Create order for authenticated users
- Validate product existence
- Validate available stock
- Atomically reduce product stock
- Prevent stock from becoming negative
- Store product price snapshot at order time
- Calculate order total
- Get logged-in user's orders
- Get individual order

## Project Structure

src/
├── config/
│   └── db.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
│
├── utils/
│   ├── asyncHandler.js
│   └── jwt.js
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.model.js
│   │   ├── auth.route.js
│   │   └── auth.validator.js
│   │
│   ├── product/
│   │   ├── product.controller.js
│   │   ├── product.service.js
│   │   ├── product.model.js
│   │   ├── product.route.js
│   │   └── product.validator.js
│   │
│   └── order/
│       ├── order.controller.js
│       ├── order.service.js
│       ├── order.model.js
│       ├── order.route.js
│       └── order.validator.js
│
├── app.js
└── server.js


## Architecture

The project follows a module-based architecture:

Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB

- Routes define API endpoints.
- Middleware handles authentication, validation, and errors.
- Controllers handle HTTP requests and responses.
- Services contain business logic.
- Models define MongoDB schemas.

## Environment Variables

Create a `.env` file in the project root:

PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=

Never commit the `.env` file to Git.

A `.env.example` file is included in the repository.

## Installation

npm install

## Run the Project

Development:

npm run dev

Production:

npm start

Server:

http://localhost:5000

Health check:

GET /health

## API Endpoints

Base URL:

http://localhost:5000/v1/api

### Authentication

#### Register

POST /auth/register

Request:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

#### Login

POST /auth/login

Request:

{
  "email": "john@example.com",
  "password": "password123"
}

Login returns a JWT token.

For protected APIs:

Authorization: Bearer <token>

## Products

### Create Product

POST /products

Authentication required.

Request:

{
  "name": "iPhone 15",
  "description": "Apple smartphone",
  "price": 69999,
  "stockQuantity": 10,
  "category": "electronics"
}

### Get Products

GET /products

### Get Product By ID

GET /products/:id

### Update Product

PATCH /products/:id

Authentication required.

### Delete Product

DELETE /products/:id

Authentication required.

Products are soft deleted instead of permanently removed.

## Product Search, Filtering & Pagination

Search by product name:

GET /products?search=iphone

Filter by category:

GET /products?category=electronics

Only products in stock:

GET /products?inStock=true

Out-of-stock products:

GET /products?inStock=false

Pagination:

GET /products?page=1&limit=10

Multiple filters:

GET /products?search=iphone&category=electronics&inStock=true&page=1&limit=10

## Orders

All order APIs require authentication.

### Create Order

POST /orders

Request:

{
  "products": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 2
    }
  ]
}

During order creation:

1. Product existence is checked.
2. Stock availability is checked.
3. Stock is reduced atomically.
4. Product price is stored as a snapshot.
5. Subtotal and total amount are calculated.
6. Order is created.

### Get My Orders

GET /orders

### Get Order By ID

GET /orders/:id

Users can only access their own orders.

## Race Condition Handling

Suppose only one product is available:

Stock = 1

User A → buys 1
User B → buys 1

The stock update uses an atomic MongoDB operation that checks the available stock and decreases it in the same database operation.

This prevents stock from becoming negative and ensures that both users cannot successfully purchase the same last item.

For complete all-or-nothing behavior across multiple products, a MongoDB transaction with a replica set would be preferred in production.

## Validation

Request validation is handled using Zod.

Validation covers:

- Required fields
- Email format
- Password length
- Product data
- Product IDs
- Order quantities
- Duplicate products
- Pagination values
- Query parameters

Invalid requests return:

400 Bad Request

## Error Handling

The application uses centralized error handling.

Common HTTP status codes:

200 OK
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
500 Internal Server Error

Async controller errors are handled through `asyncHandler`.

## Security

Basic security practices include:

- Password hashing using bcrypt
- JWT authentication
- Password excluded from normal user queries
- CORS
- Environment variables for secrets
- Input validation using Zod

## Postman Collection

The Postman collection is available at:

postman/inventory-order-api.postman_collection.json

Import the collection into Postman to test the APIs.

It contains:

- Authentication APIs
- Product CRUD APIs
- Product search/filter APIs
- Order APIs

## AI Tools Usage

AI tools were used as a development assistant for:

- Project architecture discussion
- Boilerplate code generation
- Debugging
- Validation and error handling review
- MongoDB stock concurrency discussion
- Documentation

All generated code was reviewed, integrated, tested, and debugged manually.

## Testing

The following flows were tested using Postman:

- User registration
- User login
- JWT protected routes
- Product CRUD
- Product search
- Category filtering
- Stock filtering
- Pagination
- Order creation
- Insufficient stock handling
- Stock reduction
- User order listing
- Individual order access
- Soft deleted product handling

