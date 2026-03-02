# 🛡️ Scope Creep Protector

**Guarding your time and sanity with AI-powered contract analysis.**

Scope Creep Protector is a specialized tool designed for freelancers, agencies, and project managers. It uses Google's Gemini AI to analyze incoming client requests against an existing project contract, identifying "scope creep" before it happens.

---

## ✨ Features

- **📄 Contract Parsing**: Paste your project contract once to establish the "source of truth."
- **💬 Real-time Analysis**: Enter any client message (email, Slack, etc.) to check if it fits within the agreed-upon scope.
- **🤖 AI-Powered Insights**: Uses `gemini-2.5-flash` to provide clear reasoning on why a request is in or out of scope.
- **🎨 Modern UI**: Built with a sleek, responsive React interface using Tailwind CSS and Lucide icons.

---

## 🚀 Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **AI Engine**: [Google Generative AI (Gemini)](https://ai.google.dev/)

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [Google AI Studio API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd projectamd
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_actual_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   node index.js
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📁 Project Structure

```text
projectamd/
├── backend/            # Express server & Gemini integration
│   ├── index.js        # Main API logic
│   └── .env            # Backend configuration (ignored by git)
└── frontend/           # Vite-React frontend
    ├── src/
    │   ├── components/ # Dashboard & Chat components
    │   └── App.jsx     # Main application entry
    └── tailwind.config.js
```

---

## 📜 License

This project is licensed under the [ISC License](file:///c:/Users/shubh/Desktop/development/projectamd/backend/package.json).
