# 🩸 VitalBridge

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

A modern **AI-ready Blood Bank Management System** built using the **MERN Stack** that connects **Donors, Blood Banks, Hospitals, Blood Laboratories, and Administrators** on a centralized platform for efficient blood donation and emergency blood request management.

---

# Overview

VitalBridge is a full-stack web application designed to digitize and simplify blood bank operations.

The platform streamlines donor registration, blood inventory management, blood request processing, facility verification, and administrative workflows while maintaining secure authentication and role-based authorization.

It is built with scalability in mind and serves as a foundation for future AI-powered healthcare services.

---

# Key Features

## Authentication & Security

- JWT Authentication
- Password Encryption (bcrypt)
- Protected Routes
- Role-Based Authorization

---

## Donor Portal

- Register as Donor
- Manage Profile
- View Donation History
- Submit Blood Donations
- Track Requests

---

## Hospital Portal

- Register Hospital
- Request Blood Units
- Track Request Status
- Manage Blood Requirements

---

## Blood Bank Portal

- Blood Inventory Management
- Blood Stock Updates
- Accept / Reject Requests
- Blood Availability Tracking

---

## Blood Laboratory

- Blood Testing Records
- Blood Unit Verification
- Inventory Updates

---

## Admin Portal

- Dashboard Analytics
- Facility Verification
- User Management
- Hospital Approval
- Blood Bank Approval
- System Monitoring

---

# Planned AI Features

The next version of VitalBridge will include AI-powered healthcare assistance.

### AI Chat Assistant

- Google Gemini / OpenAI Integration
- Donor Assistance
- Blood Donation FAQs
- Hospital Support
- Blood Eligibility Guidance

### Smart Emergency Alerts

- Automatic email notifications
- Notify eligible donors
- Notify nearby blood banks
- Emergency blood shortage alerts

### AI Recommendations

- Blood demand prediction
- Donor matching
- Inventory optimization
- Smart analytics

### Donation Certificate Generator

- Automatic PDF generation
- QR Verification
- Digital certificates
- Email delivery

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
- JWT
- bcrypt

---

# Project Architecture

```text
Users
│
├── Donor
├── Hospital
├── Blood Bank
├── Blood Lab
└── Admin
        │
        ▼
 React Frontend (Vite)
        │
 REST API
        │
Express.js Backend
        │
MongoDB Atlas
```

---

# Project Structure

```text
vitalbridge/

backend/
├── controllers/
├── middleware/
├── models/
├── openapi/
├── routes/
├── seedAdmin.js
├── server.js
└── package.json

frontend/
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── assets/
├── package.json
└── vite.config.js

README.md
.gitignore
```

---


# Getting Started

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas
- Git

---

## Clone Repository

```bash
git clone https://github.com/karthikvemula23/vitalbridge.git

cd vitalbridge
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## Seed Administrator

Update `backend/seedAdmin.js` if necessary.

```bash
node seedAdmin.js
```

---

## Run Backend

Development

```bash
npm run dev
```

Production

```bash
npm start
```

Backend

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# API Documentation

Swagger/OpenAPI documentation is available after starting the backend.

```
http://localhost:5000/api-docs
```

---

# REST APIs

Current modules include:

- Authentication
- Donors
- Hospitals
- Blood Banks
- Blood Laboratories
- Blood Inventory
- Blood Requests
- Facility Verification
- Administration

---

# Future Roadmap

- AI Chatbot (Gemini/OpenAI)
- Email Notifications
- SMS Notifications
- Donation Certificate Generator
- Blood Demand Prediction
- Real-Time Notifications
- AI Analytics Dashboard
- Mobile Application
- QR Code Verification
- GIS-Based Nearby Donor Search
- Multi-language Support

---

# Contributing

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "feat: add new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# Author

**Vemula Karthik**

GitHub

https://github.com/karthikvemula23

LinkedIn

https://www.linkedin.com/in/vemula-karthik-4a3309363/

---

# License

This project is licensed under the MIT License.
