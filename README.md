# VitalBridge

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

VitalBridge is a modern full-stack MERN application that connects blood donors, healthcare facilities, hospitals, and administrators through a unified digital ecosystem. It streamlines donor registration, inventory tracking, emergency blood requests, facility operations, and administrative workflows with a secure, scalable, and user-friendly experience.

---

## Key Features

### Donor
- Secure registration and authentication
- Personalized donor dashboard
- Blood donation eligibility tracking
- Donation history
- Blood camp participation

### Healthcare Facility
- Facility registration and verification
- Blood inventory management
- Blood stock updates
- Donation recording
- Blood camp management

### Hospital
- Submit and manage blood requests
- Track request status
- View blood availability
- Emergency blood requests

### Administrator
- Analytics dashboard
- Donor management
- Facility verification
- Inventory monitoring
- Blood camp oversight
- System statistics

---

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

### API Documentation
- Swagger (OpenAPI)

---

## Project Structure

```text
vitalbridge/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── openapi/
│   ├── routes/
│   ├── seeds/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/karthikvemula23/vitalbridge.git
cd vitalbridge
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
---

# Author

**Vemula Karthik**

GitHub

https://github.com/karthikvemula23

LinkedIn

https://www.linkedin.com/in/vemula-karthik-4a3309363/

---

# License

This project is licensed under the **MIT License**.
