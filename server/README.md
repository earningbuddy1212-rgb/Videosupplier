# Server (Video Supplier)

Environment variables: copy `.env.example` to `.env` and set values:
- UPLOAD_PASSWORD (required)
- JWT_SECRET (required)
- PORT (optional, default 4000)
- CLIENT_ORIGIN (optional, default http://localhost:5173)

Install & run:

```bash
cd server
npm install
npm run dev
```

Endpoints:
- POST /login { password } -> { token }
- GET /videos -> [{ name, size }]
- GET /videos/:name -> stream (supports Range)
- POST /upload (Authorization: Bearer <token>) form-data file

Notes: This is a demo scaffold. Use secure storage and HTTPS in production.
