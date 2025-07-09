# User Management Application

## Quick Start

A simple user management website built with React.js + Typescript as frontend, Express.js + Typescript as backend and MongoDB database.

---

## Features

- *Users Listing:* View all users in a table format
- *Create User:* Form to add new users with validation
- *Validation:* Both frontend and backend validation for data integrity

---

## Tech Stack

- *Frontend:* React.js with React Router  and Redux with Typescript
- *Backend:* Express.js and Typescript with MongoDB  
- *Database:* MongoDB  
- *Containerization:* Docker & Docker Compose

---

## Quick Start

### 1. Clone and navigate to the project:

```
git@github.com:germanwalakarishma/sapiens.git
```


### 2. Run with Docker Compose:

```
docker-compose up --build
```


### 3. Access the application:

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000

---

## Validation Rules

### First Name & Last Name
- Only alphabetical characters allowed
- Maximum 10 characters

### Email
- Must be a valid email format
- Must be unique

---

## API Endpoints

- GET /api/users - Get all users  
- POST /api/users - Create a new user

---

## Development

To run in local:

# Backend

```
cd backend
npm install
npm start
```

# Frontend

```
cd frontend
npm install
npm start
```