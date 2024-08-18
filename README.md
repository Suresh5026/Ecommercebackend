# E-commerce Website for Dresses (Backend)

## Overview
This is the backend for an e-commerce website focused on selling dresses. It handles product management, user authentication, shopping cart functionality, and payment processing via Razorpay. The backend is built with Node.js, Express.js, and uses MongoDB for data storage.

## Features
- **Product Management**:
  - Create, read, update, and delete products.

- **User Authentication**:
  - Register and login users with JWT authentication.
  - Secure password storage using bcrypt.

- **Shopping Cart**:
  - Manage cart items for users.

- **Payment Integration**:
  - Process payments using Razorpay.

## Tech Stack
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM library for MongoDB.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **Body-Parser**: Middleware for parsing request bodies.
- **dotenv**: Module for managing environment variables.
- **jsonwebtoken**: Library for generating and verifying JSON Web Tokens.
- **bcryptjs**: Library for hashing passwords.
- **Razorpay**: Payment gateway for handling transactions.