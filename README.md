# 🏌️‍♂️ DigitalHeros - Golf Charity Subscription Platform

DigitalHeros is a full-stack web application designed for golf charity subscriptions, lucky draws, and winner management. This project was migrated from a Supabase stack to a custom Node.js/MongoDB architecture for enhanced flexibility and deployment control.

## 🚀 Live Links
- **Frontend (Vercel)**: [Live Site](https://golf-charity-system.vercel.app)
- **Backend (Render)**: [API Health Check](https://golf-charity-system-zr0t.onrender.com/api/health)

## 🛡️ Administrative Bypass Mode
For immediate demonstration and evaluation, the project currently runs in **ADMIN_BYPASS** mode. This allows full access to the Admin Panel and Draw features without a functioning MongoDB Atlas connection.

### 🔑 Credentials (Bypass Mode)
- **Admin Email**: `admin@digitalheros.com`
- **Password**: `any_password`

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, TailwindCSS, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth.
- **Deployment**: Vercel (Frontend), Render (Backend).

## 📂 Project Structure
```text
├── Backend/           # Node.js API server
│   ├── config/        # DB and Supabase configurations
│   ├── controllers/   # Business logic (Auth, Draws, Charities)
│   ├── models/        # Mongoose schemas (MongoDB)
│   └── routes/        # API endpoints
├── Frontend/          # React + Vite application
│   ├── src/           # Source code (Components, Pages, Services)
│   └── public/        # Static assets
└── railway.json       # Deployment configuration
```

## ⚙️ Deployment Settings
To run this project on Render/Vercel (Production):
- **Root Directory**: `Backend` (for Render), `Frontend` (for Vercel).
- **Env Vars**:
  - `MONGO_URI`: MongoDB connection string.
  - `JWT_SECRET`: Secret key for authentication.
  - `ADMIN_BYPASS`: Set to `true` to enable offline bypass.
  - `VITE_API_URL`: Set to Render backend URL + `/api`.

---
*Created by sunnywinsler - 2026*
