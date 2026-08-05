# 🩸 VitalBridge

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

<p align="center">
  <strong>AI-Powered Smart Blood Donation & Emergency Response Platform</strong>
</p>

<p align="center">
VitalBridge is a modern healthcare platform built with the MERN stack that intelligently connects donors, hospitals, blood laboratories, and administrators through a secure digital ecosystem for blood donation, emergency blood requests, inventory management, and AI-assisted healthcare coordination.
</p>

---

# Overview

VitalBridge is a full-stack healthcare platform designed to modernize blood donation and emergency response through intelligent automation and cloud technologies.

Unlike traditional Blood Bank Management Systems, VitalBridge focuses on:

- Smart Blood Donation
- Emergency Blood Request Coordination
- AI-assisted Decision Support
- Intelligent Donor Matching
- Blood Demand Prediction
- Automated Notifications
- QR-based Digital Certificates
- Cloud-ready Deployment

The platform enables seamless collaboration between donors, hospitals, blood laboratories, and administrators while reducing manual effort and improving emergency response time.

---

# Highlights

- 🤖 AI Healthcare Assistant
- 🩸 Smart Blood Donation Platform
- 🚨 Emergency Blood Request Management
- 📈 Blood Demand Prediction
- 📧 Automated Donor Email Notifications
- 📄 QR-Based Digital Certificates
- 📊 AI Reports & Analytics
- 🔐 Secure Role-Based Authentication
- ☁️ Cloud Ready (AWS + MongoDB Atlas)

---

# 👥 Stakeholders

## 🩸 Donor

- Register & Login
- Manage Profile
- Check Donation Eligibility
- Donate Blood
- View Donation History
- Download QR Certificate
- Receive Donation Reminders
- Receive Emergency Blood Request Emails

---

## 🏥 Hospital

- Register Hospital
- Search Blood Inventory
- Submit Blood Requests
- Track Request Status
- View Blood Availability
- Receive Notifications

---

## 🧪 Blood Laboratory

- Manage Blood Inventory
- Verify Blood Units
- Update Blood Stock
- Process Blood Requests
- Organize Blood Camps

---

## 👨‍💼 Administrator

- Verify Healthcare Facilities
- Approve Hospitals & Blood Labs
- Manage Users
- Monitor Blood Inventory
- View Reports
- Monitor AI Analytics
- Manage System Activities

---

# 🤖 AI & Intelligent Automation

## AI Healthcare Assistant

- Healthcare Chatbot
- Blood Donation Guidance
- Eligibility Assistance
- Donation FAQs
- Hospital Support

---

## Smart Decision Support

- Blood Demand Prediction
- Intelligent Donor Matching
- Blood Shortage Analysis
- AI Reports
- Healthcare Analytics

---

## 🚨 Emergency Notification Workflow

When a hospital raises an emergency blood request, VitalBridge automatically:

1. Detects the required blood group.
2. Searches the donor database.
3. Checks donor eligibility.
4. Identifies eligible donors.
5. Sends automated email notifications.
6. Tracks request completion.

This significantly improves emergency response time.

---

## Automation

- Email Notifications
- Approval Emails
- Donation Reminders
- Emergency Alerts
- PDF Certificate Generation
- QR Code Verification
- Report Generation

---

# 🏗 System Architecture

```text
                           USERS

        Donor    Hospital    Blood Lab    Admin
             \       |          |         /
              \      |          |        /
               ───────── Web Application ─────────
                    React + Vite Frontend
                           │
                     HTTPS / REST API
                           │
                  Node.js + Express Backend
                           │
      ┌──────────────┬───────────────┬──────────────┐
      │              │               │              │
Authentication  Blood Services   AI Services   Notifications
      │              │               │              │
      └──────────────┴───────────────┴──────────────┘
                           │
                    MongoDB Atlas
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
      Gemini AI       Email Service     PDF + QR
```

---

# ⚙ Tech Stack

| Category | Technologies |
|------------|-------------|
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| AI | Google Gemini API |
| Email | Nodemailer |
| Documentation | Swagger / OpenAPI |
| Certificates | PDFKit / jsPDF, QR Code |
| Version Control | Git, GitHub |
| Deployment | AWS (Planned) |

---

# 📂 Project Structure

```text
vitalbridge/

backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── openapi/
├── seedAdmin.js
├── server.js
└── package.json

frontend/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── utils/
│
├── package.json
└── vite.config.js

README.md
.gitignore
```

---

# 📸 Screenshots

> Add screenshots after implementation.

- Login Page
- Donor Dashboard
- Hospital Dashboard
- Blood Laboratory Dashboard
- Admin Dashboard
- Blood Inventory
- Blood Request Management
- AI Assistant
- Reports Dashboard
- QR Certificate

---

# 🚀 Getting Started

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

Create a `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_password

GEMINI_API_KEY=your_api_key
```

---

## Seed Administrator

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

Backend URL

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

# 📚 API Documentation

Swagger Documentation

```
http://localhost:5000/api-docs
```

---

# REST Modules

- Authentication
- Donor Management
- Hospital Management
- Blood Laboratory Management
- Blood Inventory
- Blood Requests
- Blood Camps
- Facility Verification
- Administration
- AI Services
- Reports
- Notifications

---

# 🛣 Roadmap

- [x] MERN Stack Setup
- [x] JWT Authentication
- [x] Role-Based Authorization
- [x] Donor Module
- [x] Hospital Module
- [x] Blood Laboratory Module
- [x] Admin Module
- [x] Blood Inventory Management
- [x] Blood Request Workflow
- [ ] AI Healthcare Chatbot
- [ ] Smart Donor Matching
- [ ] Blood Demand Prediction
- [ ] Emergency Email Notifications
- [ ] PDF Certificate Generator
- [ ] QR Certificate Verification
- [ ] Reports Dashboard
- [ ] AWS Deployment
- [ ] Mobile Application

---

# 🌍 Vision

VitalBridge aims to transform conventional blood donation management into an intelligent healthcare ecosystem by combining artificial intelligence, automation, predictive analytics, and cloud technologies. The platform is designed to improve emergency response, reduce blood shortages, enhance coordination among healthcare stakeholders, and enable data-driven decision-making for modern healthcare systems.

---

# 🤝 Contributing

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "feat: add awesome feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Vemula Karthik**

GitHub

https://github.com/karthikvemula23

LinkedIn

https://www.linkedin.com/in/vemula-karthik-4a3309363/

---

# 📄 License

This project is licensed under the **MIT License**.
