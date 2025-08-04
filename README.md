# ⚡ MathService — Fullstack Math Microservice

A clean, performant, and visually elegant web application for performing mathematical operations (power, factorial, Fibonacci), monitoring system performance, and viewing an operation history log.

---

## 🧠 Project Overview

This project is a modern fullstack app with:

- 🔧 **Backend**: [FastAPI](https://fastapi.tiangolo.com/) — lightweight, fast, and fully typed REST API
- 💻 **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- 🎨 Custom UI: initially scaffolded with [Lovable.dev](https://lovable.dev), then fully customized
- 📊 Features: system metrics, audit history, export to CSV, real-time stats, animated UI
- 🚢 Deployment-ready via Docker & Render

---

## 📦 Tech Stack

### Backend
- **FastAPI**
- **Pydantic**
- **SQLite** (can easily swap with PostgreSQL)
- **SQLAlchemy ORM**
- **Uvicorn** (for ASGI serving)
- Dockerized for local + cloud use

### Frontend
- **React 18** via **Vite**
- **Tailwind CSS** w/ theme tokens (`hsl(var(--token))`)
- **Framer Motion** (animations)
- **Lucide Icons**
- **ShadCN UI components**
- **Recharts** (for data visualization)
- **TanStack Query (React Query)** for API calls and caching

---

## ✨ Features

### 🔢 Mathematical Operations
- Power: `a^b`
- Factorial: `n!`
- Fibonacci: `F(n)`

### 🧾 Operation History
- Visual log of all operations
- Filters and search
- CSV export functionality (work in progress)

### 📊 System Monitoring
- Real-time metrics: request counts, success rate, avg response time
- Uptime counter
- Status alerts with smooth UI transitions

### 💡 Dark Mode & Responsive
- Fully theme-aware
- Mobile-first, adaptive layout
- Semantic design tokens (e.g. `--primary`, `--background`, etc.)

---

## 🗂 Project Structure
├── app/ # FastAPI app (models, routes, main.py)

├── static/ # Frontend static build (served by FastAPI)

├── src/ # React frontend source (pages, components, lib)

├── Dockerfile

├── docker-compose.yml

├── requirements.txt

└── README.md



---

## 🚀 Getting Started (Dev)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/mathservice.git
cd mathservice
```

### 2. Backend

```bash
# Create a virtual env
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
```

```bash
# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend

```bash
# Install JS modules
npm install
```

### 4. Docker usage 
```bash
# Build & start both backend and frontend
docker-compose up --build
```

### 5. Run the app (backend and frontend)
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```


## API Endpoints

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/api/power`     | Calculate power         |
| POST   | `/api/factorial` | Calculate factorial     |
| POST   | `/api/fibonacci` | Calculate fibonacci     |
| GET    | `/api/history`   | Retrieve all operations |
| GET    | `/api/metrics`   | Get system statistics   |


## Future improvements

- PostgreSQL + Alembic migrations

- Redis-based caching for metrics

- Role-based auth or API key

- SSR support via Remix or Next.js

## The project is already deployed on Render and could be viewed by following this URL:
https://quick-maths.onrender.com


