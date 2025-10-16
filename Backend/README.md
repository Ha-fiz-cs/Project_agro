# Agro Backend

Express + MongoDB backend with JWT authentication and security best practices.

Quick start

1. Copy `.env.example` to `.env` and set values.
2. npm install
3. npm run dev

Available scripts

- `npm start` - start server
- `npm run dev` - start with nodemon

API Overview

- POST /api/auth/register - register user
- POST /api/auth/login - login and receive JWT
- GET /api/profile - protected profile endpoint
- CRUD /api/items - protected sample resource

Notes

This scaffold is designed for local development. For production, configure a managed MongoDB, strong JWT secret, HTTPS and process manager.

In-memory MongoDB fallback

If you don't set `MONGO_URI` in `.env`, the app will start an in-memory MongoDB (via `mongodb-memory-server`) so you can run the API and smoke tests without a separate DB.

Smoke test

After starting the server (node src/index.js), you can run the quick smoke test which will register, login and create an item:

```powershell
# from repository root
node -e "require('./src/utils/smokeTest')()"
```

Or POST to the server endpoint:

```powershell
Invoke-RestMethod -Uri 'http://localhost:4000/run-smoke' -Method Post
```

