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

`POST /auth/login`
Content-Type: application/json

```json
{
  "username": "client01",
  "password": "123456"
}
```

**Response**

```json
{
    "code": 200,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 5,
            "role": "admin"
        },
        "forcePasswordChange": true,
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImNsaWVudF9pZCI6MCwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbjEiLCJlbWFpbCI6ImFkbWluMUBleGFtcGxlLmNvbSIsImZvcmNlX3Bhc3N3b3JkX2NoYW5nZSI6dHJ1ZSwiaWF0IjoxNzU2NDAzMTc0LCJleHAiOjE3NTY0MDY3NzR9.Cuwbg3OZYKHfMkiBVyWASrRr4dc0mS89-X4uu-e85mQ",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImNsaWVudF9pZCI6MCwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbjEiLCJlbWFpbCI6ImFkbWluMUBleGFtcGxlLmNvbSIsImZvcmNlX3Bhc3N3b3JkX2NoYW5nZSI6dHJ1ZSwiaWF0IjoxNzU2NDAzMTc0LCJleHAiOjE3NTcwMDc5NzR9.f_fWYQRU-aYJwznj_sWVrp31TekYVagWIIeCewr5FxY"
    }
}
```

## 📜 License
MIT License © 2025 IrsyadXNeko