# 🚀 Deployment Guide: Community Emergency Response Platform

This guide covers deploying the full-stack application using **Render** (Backend) and **Vercel** (Frontend).

---

## 1. 🔙 Backend Deployment (Render)

Render is ideal for the Node/Express backend because it supports WebSockets (Socket.IO).

1.  **Create a New Web Service** on [Render.com](https://render.com/).
2.  **Connect your GitHub Repository**.
3.  **Configuration**:
    *   **Name**: `incident-system-api`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Environment Variables**: Add the following in the Render dashboard:
    *   `PORT`: `10000` (Render's default)
    *   `MONGO_URI`: *Your MongoDB Atlas Connection String*
    *   `JWT_SECRET`: *A long random string*
    *   `CLIENT_URL`: *The URL of your frontend (you'll get this after step 2)*
    *   `CLOUDINARY_CLOUD_NAME`: *From your Cloudinary dashboard*
    *   `CLOUDINARY_API_KEY`: *From your Cloudinary dashboard*
    *   `CLOUDINARY_API_SECRET`: *From your Cloudinary dashboard*
    *   `NODE_ENV`: `production`

---

## 2. 🎨 Frontend Deployment (Vercel)

Vercel is the fastest way to deploy React/Vite applications.

1.  **Create a New Project** on [Vercel.com](https://vercel.com/).
2.  **Connect your GitHub Repository**.
3.  **Configuration**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `client`
4.  **Environment Variables**: Add the following:
    *   `VITE_API_URL`: *The URL of your Render backend (e.g., `https://incident-system-api.onrender.com/api`)*
5.  **Deploy!**

---

## 3. 🔄 Final Sync

Once both are deployed:
1.  Copy the **Vercel URL** (e.g., `https://incident-reporting.vercel.app`).
2.  Go back to your **Render Service Settings**.
3.  Update the `CLIENT_URL` environment variable with your Vercel URL.
4.  Restart the Render service.

---

## 🛠️ Local Build Test
Before deploying, verify everything builds correctly locally:

```bash
# Test Backend
npm run build # if you add a build step

# Test Frontend
cd client
npm install
npm run build
```

## 🐳 Docker Option
If you prefer Docker, the repository includes `Dockerfile` and `docker-compose.yml`. You can deploy this entire stack to **Railway.app** or **Fly.io** by simply pointing to the root directory.
