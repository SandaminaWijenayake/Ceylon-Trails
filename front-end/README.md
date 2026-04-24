# Travel Booking Website

A full-stack booking platform designed for small travel agencies and villa owners to manage tours, bookings, and customers without relying on expensive third-party systems.

## 🚀 Live Demo

- **Frontend**: [\[Netlify URL\]](https://ceylon-trails.netlify.app/)
- **Backend API**: [\[Render URL\]](https://ceylon-trails-server-oiz6.onrender.com)

> ⚠️ **Note**: Backend is on Render's free tier and spins down after 15 min of inactivity. First request may take 10-30 seconds to wake up the server.

## 📌 About

A responsive full-stack travel booking website that allows users to browse tours, create accounts, and book their desired experiences. Includes a comprehensive admin dashboard for managing tours, bookings, and users.

## 🎯 Purpose

Many small travel businesses struggle with managing bookings and customers efficiently. This platform provides a simple, scalable solution with both user-facing booking features and a powerful admin dashboard.

## ✨ Features

- **Tour Discovery** - Browse and search available tours with detailed information
- **User Authentication** - JWT-based auth with signup/login, password hashing with bcrypt
- **Booking System** - Complete booking flow with confirmation emails via Resend
- **User Dashboard** - View booking history, saved tours, manage profile
- **Admin Dashboard** - Manage tours, bookings, users with role-based access
- **Automated Jobs** - Cron jobs for booking status updates (expired bookings auto-cancel)
- **Responsive Design** - Fully responsive UI for mobile, tablet, and desktop

## 🛠 Tech Stack

### Frontend

- React 18, Vite
- Tailwind CSS, shadcn/ui (Radix UI)
- React Router DOM
- TanStack React Query
- React Hook Form + Zod
- Lucide React

### Backend

- Express.js (Node.js)
- MongoDB + Mongoose
- Node-cron (scheduled jobs)
- Resend (email API)
- JWT + bcrypt

### Deployment

- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas

## ⚙️ Setup

```bash
# Frontend
cd front-end
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```

## 🏗️ Project Structure

```
new travel/
├── front-end/       # React + Vite frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── components/ui/  # shadcn/ui
│   │   └── hooks/
└── server/          # Express.js backend
    ├── routes/     # API endpoints
    ├── models/     # Mongoose models
    └── cron/       # Scheduled jobs
```

## 👨‍💻 My Contribution

- Built the complete full-stack application from scratch
- Created REST API endpoints with Express.js and MongoDB/Mongoose
- Implemented JWT authentication with secure password hashing using bcrypt
- Developed booking logic with automated status updates using node-cron
- Integrated Resend email API for booking confirmations
- Built role-based admin dashboard for managing tours, bookings, and users

## 📞 Contact

- WhatsApp: 0711054179
- Email: sandaminawijenayake0717@gmail.com

---

Built with React + Express + MongoDB
