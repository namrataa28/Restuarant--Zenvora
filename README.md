# 🍽️ Zenvora — Premium Fine Dining & Table Reservation App

Zenvora is a premium, full-stack (MERN) web application built to deliver an elegant food ordering and real-time table reservation experience. Designed with a luxury dark theme, gold accents, and fluid responsiveness, it caters to customers looking for fine culinary experiences and admins managing restaurant operations.

---

## 🚀 Features

### 👤 Customer Experience
* **Secure Authentication**: Signup and Login with JWT authentication and secure state persistence.
* **Exquisite Menu**: Browse dishes categorized by cuisines/courses with detailed view pages showing description, ratings, price, and ingredients.
* **Smart Cart**: Add/remove items, adjust quantities, and dynamically track subtotal calculations.
* **Instant Seating Reservation**: Reserve a table instantly with custom guest counts, date, time, and custom requests.
* **Online Payment Gateway**: Integration with Razorpay for handling online transactions.
* **Personal Portal**: View order history, order status, and table booking details in real-time.

### 🔑 Admin Panel
* **Admin Login**: Dedicated security portal to manage administrative actions.
* **Operational Dashboard**: Monitor active orders, update preparation and delivery statuses.
* **Seating Management**: View and keep track of guest table bookings.
* **Inventory Control**: Add, update, and manage categories and menu dishes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS (v4), React Router DOM, Axios, Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express.js, JWT, Cookie-parser, Multer |
| **Database** | MongoDB (via Mongoose ODM) |
| **Integrations** | Cloudinary (Image Uploads), Razorpay (Payment Processing), Nodemailer (Email notifications) |

---

## 📁 Project Structure

```text
restuarant_app/
├── backend/                  # Node.js + Express API
│   ├── config/               # Database and Cloudinary configuration
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Auth and file uploading middlewares
│   ├── models/               # MongoDB Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── seed.js               # Sample dataset seeding script
│   └── index.js              # Server entry point
│
└── frontend/                 # Vite + React Client
    ├── src/
    │   ├── assets/           # Images and media assets
    │   ├── components/       # Reusable components (Navbar, Footer, etc.)
    │   ├── context/          # Global application state (AppContext)
    │   ├── lib/              # API Axios configuration
    │   ├── pages/            # Page views (Home, Menu, Cart, Admin, etc.)
    │   ├── App.jsx           # Main routing & application entry
    │   └── index.css         # Styling, variables, and fonts
    └── package.json          # Frontend packages & configurations
