# 🩸 VitalBridge

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)

A full-stack blood bank and donor management platform built with the MERN stack to streamline blood donation, inventory management, and hospital requests.

---

# Overview

**VitalBridge** is a centralized blood bank management system designed to improve the efficiency of blood donation services by connecting administrators, donors, and hospitals on a single platform.

The application simplifies donor registration, blood inventory management, hospital request processing, and administrative operations while maintaining secure authentication and accurate record management.

Developed using the MERN stack, VitalBridge demonstrates modern full-stack development practices including RESTful API design, JWT authentication, responsive UI development, and scalable MongoDB data management.

---

# Features

- Secure JWT-based authentication
- Role-based access control
- Donor registration and profile management
- Hospital registration with administrator approval
- Blood inventory management
- Blood request creation and tracking
- Administrative dashboard
- Responsive user interface
- RESTful API architecture
- MongoDB database integration

---

# Tech Stack

## Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

# Project Structure

```text
vitalbridge/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── openapi/
│   ├── seedAdmin.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure you have installed:

- Node.js (v18 or later)
- npm
- MongoDB Atlas account (or local MongoDB)
- Git

---

## Clone the Repository

```bash
git clone https://github.com/<your-username>/vitalbridge.git

cd vitalbridge
```

---

## Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server.

```bash
npm run dev
```

or

```bash
npm start
```

---

## Seed the Admin Account

Run the admin seed script.

```bash
node seedAdmin.js
```

This creates the default administrator account for accessing the admin dashboard.

---

## Frontend Setup

Open a new terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

# API Overview

The backend provides RESTful APIs for:

- Authentication
- Donor Management
- Hospital Management
- Blood Inventory
- Blood Requests
- Administrative Operations

---

# Future Improvements

Potential enhancements include:

- Email notifications
- Blood donation scheduling
- Analytics dashboard
- Real-time inventory updates
- Mobile application support

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Author

**Vemula Karthik**

GitHub: https://github.com/karthikvemula23Create a `.env` file inside the `backend` directory.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## Seed the Administrator Account

Before starting the backend server for the first time, create the administrator account.

Open:

```text
backend/seedAdmin.js
```

Update the administrator credentials if required, then run:

```bash
node seedAdmin.js
```

This will create the initial administrator account in the database.

---

## Start the Backend Server

```bash
npm start
```

The backend will be available at:

```text
http://localhost:5000
```

---

## Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

# License

This project is licensed under the MIT License.
