# 🏌️‍♂️ DigitalHeros - Golf Charity Subscription Platform

DigitalHeros is a premium full-stack platform that combines charitable giving with an engaging monthly lucky draw system. Our mission is to support global charities through a community-driven subscription model.

## 🔗 Live Deployments
- **Main Application**: [Vercel Deployment](https://golf-charity-system.vercel.app)
- **Admin Dashboard**: [Access Admin Panel](https://golf-charity-system.vercel.app/admin)
- **API Health Check**: [Render Status](https://golf-charity-system-zr0t.onrender.com/api/health)

---

## 🧭 How It Works (Core Logic)

### 1. Subscription & Impact 💳
Users join the platform by choosing a **Monthly or Yearly subscription**. A significant portion of every subscription fee is automatically allocated to support charitable causes.

### 2. Choose Your Impact 🌍
Each subscriber selects a **preferred charity** (e.g., Kids Global, Cancer Research Center). This personalization ensures that your contribution supports the causes you care about most.

### 3. The Monthly Draw 🎡
Every month, the platform executes a **Provably Fair Lucky Draw**.
- **The Pool**: The total prize pool is generated from a portion of the subscription revenue.
- **The Numbers**: 5 winning numbers are drawn from a range of 1 to 45.

### 4. Smart Draw Algorithm 🧠
The platform supports two drawing modes:
- **Random Mode**: Purely stochastic number generation.
- **Algorithmic Mode**: Uses historical data to select the **least frequent** numbers from previous user entries, ensuring a dynamic and balanced distribution over time.

### 5. Winners & Jackpots 🏆
Prizes are distributed based on matches:
- **5 Matches**: Share 40% of the Monthly Prize Pool (The Jackpot).
- **4 Matches**: Share 35% of the Prize Pool.
- **3 Matches**: Share 25% of the Prize Pool.
- **Rollover**: If no one hits 5 matches, the 40% jackpot **rolls over** to the next month, creating massive potential prizes!

---

## 🛡️ Development & Bypass Mode
The project is currently configured with `ADMIN_BYPASS=true` to allow for immediate evaluation and demonstration.

### 🔑 Bypass Login
- **Email**: `admin@digitalheros.com`
- **Password**: `any_password`

---

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, Recharts.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT.
- **Infrastructure**: Vercel (Frontend), Render (Backend), GitHub Actions.

## 📂 Project Structure
```text
├── Backend/           # Express API Server
│   ├── controllers/   # App Logic (Draws, Auth, etc.)
│   ├── models/        # MongoDB Data Schemas
│   └── index.js       # App Entry Point
├── Frontend/          # React SPA
│   ├── src/pages/     # Admin & User Interfaces
│   └── src/services/  # API Interceptors
```

---
*Developed for Social Impact & Excellence.* 🏌️‍♂️✨
