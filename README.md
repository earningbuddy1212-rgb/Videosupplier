# Video Supplier

A simple full-stack video streaming platform where only the site owner can upload videos and everyone else can watch them.

## Overview
- **Backend:** Node.js + Express that serves video streaming with Range headers and a protected upload endpoint.
- **Frontend:** Vite + React app with a clean black/purple/orange theme.

## Quick start
1. Copy `.env.example` to `.env` in `server/` and set `UPLOAD_PASSWORD` and `JWT_SECRET`.
2. Development (run server and client locally):

```bash
# server
cd server && npm install && npm run dev
# client (in new terminal)
cd client && npm install && npm run dev
```

Open the client URL (default http://localhost:5173).

## Deploy with Docker (recommended for quick production-like deploy)
1. Build and run with docker-compose (creates a production container with client built and served by server):

```bash
# build and start
docker compose up --build -d
# check logs
docker compose logs -f
```

2. Visit http://localhost:4000 — the frontend will be served from the server container.

> Files are persisted under `server/videos/` (mounted into the container).

## Deploy client to GitHub Pages (static hosting)
You can publish the static frontend to GitHub Pages while hosting the backend elsewhere (GH Pages is static-only).

1. The Vite `base` is set to `/Videosupplier/` so the site works on `https://<your-user>.github.io/Videosupplier/`.
2. A GitHub Actions workflow is included at `.github/workflows/gh-pages.yml` that will build `client` and publish `client/dist` to the `gh-pages` branch when you push to `main`.

Optional: Add a repo secret named `BACKEND_URL` with your server URL, so the client can call the real backend at build time (the workflow will set `VITE_API` during the build). If not set, the frontend defaults to `http://localhost:4000`.

After the workflow completes, set repository Pages source (Settings → Pages) to `gh-pages` branch (root) or visit the auto-generated Pages URL.

## Deploy backend to Render (one-click automatic deploy)
I added a workflow `.github/workflows/deploy-render.yml` that will trigger a deploy on Render every time you push to `main`.

What you need to do:
1. Create a Render account, then create a **Web Service** pointing to this repository (prefer Docker or connect to the repo). Follow Render's UI to connect the repository and configure a service to build from `Dockerfile` (we included a multi-stage `Dockerfile` that builds client and server).
2. In the Render dashboard, get the **Service ID** for your service. (From the service page URL or Render API.)
3. In GitHub, add two repository secrets: `RENDER_API_KEY` (your Render API key) and `RENDER_SERVICE_ID` (the service ID you retrieved).
4. Push to `main` — the `deploy-render` workflow will POST `/v1/services/<SERVICE_ID>/deploys` to start a deploy on Render.

Notes:
- Render will build the image and publish it with HTTPS and a public URL. After the deploy completes, set the repo secret `BACKEND_URL` to your service URL so the frontend can be built with the real API endpoint (optional). Or set `BACKEND_URL` in the GH Pages workflow so the client calls the live backend.
- If you prefer, I can create the Render service for you if you give me the Render API key and allow creating resources; otherwise I can guide you step-by-step in your Render dashboard.

## Security note
This is a reference scaffold. For production, use secure storage (S3), HTTPS, proper auth, secrets management, and a database for metadata.
