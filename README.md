# Demo Credit Wallet Service MVP

## Table of Contents

1. Introduction
2. Features
3. Architecture
4. API Endpoints
5. Database Schema
6. Authentication and Authorization
7. Error Handling
8. Dependencies
9. Environment Variables
10. Testing

## 1. Introduction

The Demo Credit Wallet Service MVP is designed to support basic wallet functionalities required for a mobile lending app. The key functionalities include user account creation, user account login, funding accounts, transferring funds, withdrawing funds, and ensuring users on the Lendsqr Adjutor Karma blacklist are not onboarded.

## 2. Features

- **User Registration**: Create a user account.
- **User Login**: User login.
- **Fund Account**: Add funds to the user's account.
- **Transfer Funds**: Transfer funds to another user's account.
- **Withdraw Funds**: Withdraw funds from the user's account.
- **Blacklist Check**: Prevent users on the Lendsqr Adjutor Karma blacklist from being onboarded.

## 3. Architecture

The service is designed using a RESTful API architecture. The key components are:

- Express.js: Web framework for handling HTTP requests and routing.
- MySQL: Database for storing user and transaction data.
- Knexjs: ORM for mySQL.
- Axios: HTTP client for making requests to external services (e.g., blacklist check).

## 4. API Endpoints

### **_Auth Endpoints_**

- **POST /auth/create-account**

Request Body: { "email": "string", "password": "string", "firstname": "string", "lastname": "string", phone:"string" }
Description: Registers a new user after checking the blacklist.

- **POST /users/login**

Request Body: { "email": "string", "password": "string" }
Description: Authenticates a user and returns a JWT token.

### **_Transactions Endpoints_**

- **POST /transactions/fund-account**

Request Body: { "amount": "number" }
Description: Funds the user's wallet.
Authentication: Bearer Token

- **POST /transations/transfer-funds/:receipient_wallet_id**

Request Body: { "recipientId": "string", "amount": "number" }
Description: Transfers funds to another user's wallet.
Authentication: Bearer Token

- **POST /transactions/withdraw-funds**

Request Body: { "amount": "number" }
Description: Withdraws funds from the user's wallet.
Authentication: Bearer Token

## 5. Database Schema

![alt text](https://github.com/IgweChido/Lendsqr-Backend-Engineer-Assessment/blob/main/assets/er-diagram.png?raw=true)

## 6. Authentication and Authorization

JWT (JSON Web Token): Used for securing endpoints.
Middleware: Custom middleware to verify JWT tokens and protect routes.

## 7. Error Handling

Consistent error responses with appropriate HTTP status codes.
Custom error classes to handle different error types.

## 8. Dependencies

- express: For creating the server and handling routes.
- jsonwebtoken: For generating and verifying JWT tokens.
- axios: For making HTTP requests to external APIs.
- dotenv: For managing environment variables.

## 9. Environment Variables

- PORT: The port number the server will listen on.
- DB_PASSWORD: MySQL database password
- DB_NAME: MySQL database name
- DB_USER: MySQL database user name
- DB_PORT: MySQL database port
- DB_HOST: MySQL database host
- JWT_SECRET: Secret key for signing JWT tokens.
- JWT_ALGO: JWT algorithm
- KARMA_API_URL: URL for the Lendsqr Adjutor Karma API.
- KARMA_API_TOKEN: Authentication token for the Karma API.

## 10. Testing

Used tools like Postman to test the API endpoints.
Implemented unit and integration tests using frameworks like Mocha and Chai .
