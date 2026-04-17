# Deployment Guide: Online Voting System

This guide explains how to deploy your system to **Render** (Backend & Database) and **Vercel** (Frontend).

## 1. Deploy the Backend to Render

Using the `render.yaml` Blueprint makes this very easy:

1.  Push your code to a **GitHub** repository.
2.  Log in to [Render](https://dashboard.render.com/).
3.  Click **"New +"** and select **"Blueprint"**.
4.  Connect your GitHub repository.
5.  Render will detect `render.yaml` and show you the resources it will create:
    *   **PostgreSQL Database**: `voting-db`
    *   **Web Service**: `voting-backend`
6.  Click **"Apply"**.
7.  Wait for the database and web service to deploy.
8.  **Copy your Web Service URL** (e.g., `https://voting-backend.onrender.com`).

---

## 2. Deploy the Frontend to Vercel

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  In the **"Configure Project"** screen:
    *   **Root Directory**: Select `frontend`.
    *   **Framework Preset**: Select `Vite`.
5.  Open the **"Environment Variables"** section and add:
    *   **Key**: `VITE_API_BASE_URL`
    *   **Value**: Paste your Render Backend URL followed by `/api` (e.g., `https://voting-backend.onrender.com/api`).
6.  Click **"Deploy"**.

---

## 3. Important Notes

*   **Database Synchronization**: The `render.yaml` is configured to create a PostgreSQL instance. The backend is configured to use it automatically when running on Render.
*   **Cold Starts**: Render's free tier services "spin down" after 15 minutes of inactivity. The first request to your backend might take 30-60 seconds to respond as it "wakes up."
*   **CORS**: Currently, the backend allows any origin. For a production app, you should eventually update `AuthController.java` (and others) to specifically allow your Vercel domain only.

## Local Development Still Works!
You can still run the project locally just like before. It will continue to use the in-memory H2 database for local development unless you manually provide the `DATABASE_URL` environment variable.
