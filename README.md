<div align="center">

# 💸 BrokeBuddy

### A full-stack loan tracking & management application

Track money you've lent or borrowed — with automated email reminders, Google OAuth, and a role-based dashboard.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-brokebuddy.onrender.com-6366f1?style=for-the-badge)](https://brokebuddy.onrender.com/)
[![GitHub stars](https://img.shields.io/github/stars/Canonsoda/BrokeBuddy?style=for-the-badge)](https://github.com/Canonsoda/BrokeBuddy/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📌 About the Project

BrokeBuddy is a full-stack web application that helps users track loans they've given or received. It supports multi-role dashboards (lender/borrower), secure authentication with JWT and Google OAuth, and automated email reminders via cron jobs — so you never have to awkwardly chase people for money again.

Built as a real-world project to demonstrate full-stack proficiency with the MERN stack.

---

## ✨ Features

- 🔐 **Authentication** — JWT-based auth + Google OAuth via Passport.js
- 👥 **Role-based dashboard** — Separate views for lenders and borrowers
- 📋 **Loan management** — Create, view, and track loans with status updates
- 📧 **Automated email reminders** — Nodemailer + cron jobs send reminders for due/overdue loans
- 🛡️ **Protected routes** — Backend and frontend route guards
- 📱 **Responsive UI** — Built with React and Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend**
- React.js (Vite)
- Tailwind CSS
- React Router DOM

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Passport.js (Google OAuth 2.0)
- Nodemailer + node-cron

---

## 📂 Project Structure

```
BrokeBuddy/
├── frontend/          # React + Vite client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
└── backend/           # Express API server
    ├── routes/
    ├── models/
    ├── controllers/
    └── middleware/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google OAuth credentials

### Installation

```bash
# Clone the repo
git clone https://github.com/Canonsoda/BrokeBuddy.git
cd BrokeBuddy

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
```

### Running the App

```bash
# Run backend (from /backend)
npm run dev

# Run frontend (from /frontend)
npm run dev
```

Frontend runs on `http://localhost:5173` | Backend on `http://localhost:5000`

---

## 🔮 Upcoming Features

- [ ] Image upload for loan proof/documents
- [ ] View Loans page with filters and sorting
- [ ] Redirect flow after loan creation
- [ ] Lottie animations for empty states
- [ ] Production deployment

---

## 👨‍💻 Author

**Aryan** — ECE undergrad, fullstack developer

[![GitHub](https://img.shields.io/badge/GitHub-Canonsoda-181717?style=flat&logo=github)](https://github.com/Canonsoda)

---

<div align="center">
  <sub>Built with ☕ and late nights</sub>
</div>
