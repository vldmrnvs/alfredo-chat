# Alfredo Chat - Deploy Instructions

This folder contains a clean copy of the **Alfredo Chat** project, ready for deployment.

## 🚀 How to Deploy to GitHub & Vercel

### 1. Create a GitHub Repository
1.  Go to [GitHub.com](https://github.com/new).
2.  Create a new repository (e.g., `alfredo-chat`).
3.  Do **not** initialize with README, .gitignore, or License (keep it empty).

### 2. Push this Code
Open your terminal in this `deploy` folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/alfredo-chat.git
git push -u origin main
```

*(Replace `YOUR_USERNAME` with your actual GitHub username)*

### 3. Deploy to Vercel
1.  Go to [Vercel.com](https://vercel.com/new).
2.  Import your new `alfredo-chat` repository.
3.  **Framework Preset:** Vercel should auto-detect **Vite**.
4.  **Root Directory:** `./` (default).
5.  Click **Deploy**.

## Project Details
-   **Framework:** React + Vite + TypeScript
-   **Build Command:** `npm run build`
-   **Output Directory:** `dist`
-   **Install Command:** `npm install`
