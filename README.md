# 🏢 Portal Client Backend

Portal Client is a **microservice-based client management system**.  
It allows **Admins** to manage client data, projects, invoices, and tickets, while **Clients** can view project progress, track tickets, and request personal data updates.

---

## ✨ Features
- 🔑 JWT Authentication (Access & Refresh Tokens)
- 📑 Client & Project Management
- 💳 Invoicing (manual & recurring)
- 📩 Automatic & manual email notifications (via Mailtrap)
- 🎫 Ticketing System
- 📝 Client Bio Data Update Requests
- 📊 Role-based Access Control (Admin & Client)
- 🔄 Event-driven Data Synchronization between microservices
- 🐳 Dockerized Deployment
- 📡 API Gateway with Express.js
- 📐 SOLID Principles & Clean Architecture

---

## 🛠 Tech Stack
- **API Gateway:** Express.js (TypeScript)
- **Services:** NestJS (TypeScript)
  - Auth Service
  - Client Service
  - Project Service
  - Invoice Service
  - Ticket Service
  - Notification Service
- **Database:** PostgreSQL (no ORM, raw queries)
- **Email Service:** Mailtrap
- **Containerization:** Docker & Docker Compose

---

## 📖 Example API Usage

### Login

**Request**
POST /auth/login
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "123456"
}

**Response**
{
  "code": 200,
  "message": "Login success",
  "data": {
    "accessToken": "xxxx",
    "refreshToken": "xxxx"
  }
}

## 📜 License
MIT License © 2025 IrsyadXNeko