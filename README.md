# Chemini AI — Redesigned Frontend

A production-grade SaaS-style UI for your Context-Aware Conversational AI system.
---
## 📁 Project Structure

```
chemini-ai/
├── backend/          
│   ├── app.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── package.json
│
└── frontend/        
    ├── index.html
    ├── vite.config.js        ← proxies /api/* 
    ├── tailwind.config.js
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx            ← routes:/ and /login
    │   ├── index.css          ← design tokens + glassmorphism
    │   ├── context/
    │   │   └── ThemeContext.jsx   ← dark/light mode
    │   ├── utils/
    │   │   └── api.js         ← axios with relative URLs
    │   ├── pages/
    │   │   ├── Login.jsx      ← redesigned auth page
    │   │   └── Chat.jsx       ← main chat layout
    │   └── components/
    │       ├── Sidebar.jsx    ← animated chat list + search
    │       ├── ChatBox.jsx    ← markdown + code highlighting
    │       └── ChatInput.jsx  ← auto-resize textarea
    └── package.json
```

---

## 🚀 Setup

### 1. Backend (unchanged)
```bash
cd backend
# Create .env file:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# GEMINI_API_KEY=your_gemini_key

npm install
node app.js
# → Server running on port 5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server **automatically proxies** all `/api/*` requests to `http://localhost:5000`,
so your backend CORS config is preserved without changes.

---

## ✨ What's New in the UI

| Feature | Before | After |
|---------|--------|-------|
| Design | Inline `style={{}}` objects | Tailwind CSS + CSS variables |
| Theme | None | Dark / Light mode toggle |
| Animations | None | Framer Motion throughout |
| Sidebar | Basic list | Search, timestamps, hover actions |
| Messages | Plain `<p>` tags | Full Markdown + syntax highlighting |
| Code blocks | None | Language label + copy button |
| Input | Basic `<input>` | Auto-resize textarea, keyboard shortcuts |
| Loading | None | Animated typing indicator (3 bouncing dots) |
| Auth | Plain HTML | Glassmorphism card with animated orbs |
| Responsive | Not responsive | Mobile sidebar drawer + full responsiveness |
| Empty state | "Start a conversation..." | Animated icon + prompt suggestions |

---

## 🔌 API Compatibility

All original endpoints are called **identically**:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login |
| `/api/auth/register` | POST | Register |
| `/api/chat` | GET | Load all chats |
| `/api/chat/new` | POST | Create new chat |
| `/api/chat` | POST | Send message `{ chatId, message }` |

No changes to request/response format.

---

## 🎨 Design System

- **Font:** Plus Jakarta Sans (display) + Space Mono (code)
- **Accent:** Amber–Orange gradient (`#f59e0b → #fb923c`)
- **Dark surfaces:** `#0c0c0f → #18181f → #26262f`
- **Glass cards:** `backdrop-filter: blur(20px)` with subtle borders
- **Animations:** Framer Motion spring physics + CSS keyframes
