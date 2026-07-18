# VitalBridge

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)

## Overview

**VitalBridge** is a full-stack blood bank and donor management platform developed to streamline the management of blood donations, inventory, and hospital requests through a centralized web application. The platform enables administrators, hospitals, and donors to interact within a secure environment while maintaining accurate records and improving operational efficiency.

Traditional blood bank management often involves manual documentation or disconnected systems that make inventory tracking and request management difficult. VitalBridge addresses these challenges by providing a unified platform for managing blood availability, donor information, hospital requests, and administrative workflows.

Built using the MERN stack, VitalBridge demonstrates modern full-stack web development practices, secure authentication, RESTful API design, and scalable data management.

---

# Features

- Role-based authentication using JWT
- Donor registration and profile management
- Hospital registration with administrator approval
- Blood inventory management
- Blood request creation and status tracking
- Administrative dashboard
- RESTful backend APIs
- Responsive React-based user interface
- MongoDB-powered data storage

---

# Technology Stack

## Frontend

- React
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
│   ├── openapi/
│   ├── routes/
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

## Clone the Repository

```bash
git clone <repository-url>
cd vitalbridge
```

Replace `<repository-url>` with your GitHub repository URL after creating the repository.

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

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