# 🌐 GenWeb.ai — AI Website Builder

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange?logo=firebase)
![Redux](https://img.shields.io/badge/State-Redux-purple?logo=redux)
![JWT](https://img.shields.io/badge/Auth-JWT-purple)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-teal?logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/AI-OpenRouter-lightblue?logo=openai)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-darkblue?logo=razorpay)

GenWeb.ai is a MERN + AI powered platform that lets users build and deploy beautiful websites by simply typing a prompt. It integrates credits, payments, and deployment features for a seamless end‑to‑end experience.

---

## 🌐 Live Demo
🔗 GenWeb.ai Application: https://ai-website-builder-by-saikat-pradhan.onrender.com

---

## 🚀 Features

### 👤 User System
- Google login via Firebase
- Secure JWT authentication
- Credit system:
  - 100 free credits on signup
  - 50 credits per new website generation
  - 25 credits per update/change

### 🖊️ Website Builder
- AI generates websites using HTML, CSS, JavaScript
- Prompt‑based generation (just type your idea)
- Update or modify existing sites with fewer credits
- Deploy websites directly from the dashboard

### 💳 Pricing & Payments
- Razorpay integration
- Pricing section with subscription plans
- Buy credits and plans securely

---

## 🧱 Tech Stack

### Frontend
- React.js
- TailwindCSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### AI & APIs
- OpenRouter (OpenAI API)
- Firebase Authentication

### Payments
- Razorpay

---

## 🏗️ Architecture

```
React (Frontend)
        ↓
Node.js + Express (Backend)
        ↓
MongoDB (Database)
        ↓
Firebase (Auth) + JWT
        ↓
OpenRouter (AI Website Generation)
        ↓
Razorpay (Payments)
```

---

## 📂 Project Structure

```
genweb-ai/
│
├── client/        # Vite + React + TailwindCSS
│   ├── pages/
│   ├── components/
│   └── redux/
└── server/        # Node + Express + MongoDB
    ├── routes/
    ├── controllers/
    └── models/
```

---

## ⚙️ Installation & Setup

1️⃣ Clone Repository
```
git clone https://github.com/Saikat-Pradhan/AI-Website-Builder
cd AI-Website-Builder
```
---

2️⃣ Backend Setup

```
cd server
npm install
npm run dev
```

Configure .env with:

```
PORT
MONGO_URI
JWT_SECRET
OPENROUTER_API_KEY
RAZORPAY_ID_KEY
RAZORPAY_SECRET_KEY
```
---

3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

Configure .env with:

```
VITE_FIREBASE_API_KEY
VITE_SERVER_URL
VITE_RAZORPAY_ID_KEY
```

---

## 📈 Future Improvements

- Drag‑and‑drop editor for manual tweaks
- Template library for quick starts
- Multi‑page website generation
- Analytics dashboard for deployed sites

---

## ⚠️ Disclaimer

This project is for educational and practice purposes only.
It does not replace professional website development services.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
