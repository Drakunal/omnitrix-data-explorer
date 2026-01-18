# 👽 Omnitrix Lab

**Omnitrix Lab** is a data-driven exploration project inspired by *Ben 10*.  
It treats each alien as a data point and applies similarity analysis, distance metrics, and machine-learning concepts to explore alien abilities in a fun, interactive way.

This repository contains the **frontend application** of Omnitrix Lab.

---

## ✨ Features

- Browse all Ben 10 aliens with stats and visuals  
- Similarity analysis:
  - Top similar aliens
  - Most opposite alien  
- Multiple distance metrics:
  - Cosine
  - Euclidean
  - Manhattan  
- Interactive charts and visual stats  
- Clean, responsive UI  

---

## 🛠 Tech Stack

- React  
- Vite  
- TypeScript  
- Tailwind CSS  
- REST API integration  

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
````

---

### 2️⃣ Environment configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE=<BACKEND_BASE_URL>
```

Example for local backend:

```env
VITE_API_BASE=http://localhost:8000
```

Or use your deployed backend URL.

> ⚠️ The variable **must** start with `VITE_` for Vite to expose it to the app.

---

### 3️⃣ Run the development server

```bash
npm run dev
```

The app will be available at the URL shown in the terminal
(usually `http://localhost:5173`).

---

## 🔌 Backend Dependency

This frontend depends on the **Omnitrix Lab Backend**, which exposes APIs such as:

* `/aliens` – Alien dataset
* `/similarity` – Similarity & opposite analysis
* `/clustering` – Alien clustering
* `/projection` – 2D projections for visualization

Make sure the backend is running and the base URL is correctly set in `.env`.

---

## 📁 Project Structure (Simplified)

```
src/
├── components/
├── pages/
├── services/        # API calls
├── hooks/
├── utils/
└── main.tsx
```

---

## 🧠 Concept

*What if the Omnitrix was real?*

Omnitrix Lab explores that idea by combining:

* Distance-based similarity
* Machine learning concepts
* Visual analytics

All wrapped in a playful, Ben 10–inspired interface.

---

## 📌 Notes

* Built for learning, experimentation, and fun
* Inspired by the Ben 10 universe
* No affiliation with Cartoon Network

---

## ⭐️ Future Ideas

* UI-controlled clustering
* Interactive projection plots
* Alien comparison history
* Performance optimizations

## Disclaimer

This project is a fan-made, educational project inspired by the Ben 10 universe.
All character names and concepts belong to their respective owners.
This project is not affiliated with or endorsed by Cartoon Network.

