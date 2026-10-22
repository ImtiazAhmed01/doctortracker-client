# 🖥️ DoctorTracker – Frontend Client

A modern, responsive, clinical healthcare administrative dashboard built with **Next.js (App Router)**, **React**, **Recharts**, and **Firebase Authentication**.

---

## 🔗 Submission Details

- **Frontend GitHub Repository**: `[YOUR_FRONTEND_GITHUB_REPO_URL_HERE]`
- **Live Frontend Website**: `[YOUR_LIVE_FRONTEND_URL_HERE]` (e.g. `https://doctortracker-client.vercel.app`)
- **Connected Backend API**: `[YOUR_LIVE_BACKEND_API_URL_HERE]` (e.g. `https://doctortracker-api.onrender.com`)

---

## 🩺 Features Overview

- **Secure Authentication**: Firebase Google OAuth & JWT-based authentication with automatic session persistence and route protection.
- **Doctor Directory**: Complete doctor profile management (Name, Specialization, Hospital, Phone, Email) with server-side pagination, real-time search, and date-range filters.
- **Patient Registry**: Roster of patient records associated with specific doctors, tracking medical condition, contact info, and status badges.
- **Doctor's Patient Modal**: Direct access to view and manage all patients assigned under an individual doctor.
- **Interactive Analytics**: 4 clinical data visualizations using **Recharts** (Active Patients distribution, Patients per Doctor, Medical Conditions breakdown, Monthly Consultations).
- **MedBot AI Assistant**: Integrated floating chat assistant powered by Google Gemini with conversation memory and system statistics awareness.
- **Enterprise Clinical UI**: Designed in high-clarity healthcare light mode with custom SVG icons, responsive sidebar, and taskbar-safe button positioning.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (React 19)
- **Styling**: Vanilla CSS (Global Design System with clinical HSL color tokens)
- **Icons**: Custom Medical & Administrative SVG Icons
- **Data Visualization**: Recharts (AreaChart, BarChart, PieChart)
- **Authentication**: Firebase Client SDK + JWT Bearer Tokens
- **HTTP Client**: Axios with interceptors for authorization headers and error handling
- **Notifications**: React Hot Toast

---

## 📁 Project Structure

```
doctortrack-client/
├── public/                     # Static assets and icons
├── src/
│   ├── app/
│   │   ├── (protected)/        # Authenticated route group
│   │   │   ├── layout.js       # App shell: Sidebar & Topbar
│   │   │   ├── dashboard/      # Clinical analytics dashboard
│   │   │   ├── doctors/        # Doctor directory with CRUD
│   │   │   └── patients/       # Patient registry with CRUD
│   │   ├── login/              # Sign-in & registration portal
│   │   ├── globals.css         # Complete clinical design system & tokens
│   │   ├── layout.js           # Root layout with AuthProvider & Toaster
│   │   └── page.js             # Root redirect handler
│   ├── components/
│   │   ├── Chatbot.js          # MedBot AI chat drawer
│   │   ├── DoctorModal.js      # Create/Edit doctor modal
│   │   ├── PatientModal.js     # Create/Edit patient modal
│   │   ├── DoctorPatientsModal.js # Doctor's assigned patients modal
│   │   └── Icons.js            # Custom SVG icon library
│   ├── context/
│   │   └── AuthContext.js      # Global authentication state
│   └── lib/
│       ├── api.js              # Axios instance with auth interceptors
│       └── firebase.js         # Firebase client initialization
├── .env.example                # Sample environment variables
├── package.json
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x

### 2. Installation
```bash
cd doctortrack-client
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of `doctortrack-client`:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase Client Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment Instructions (e.g. Vercel)

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository and select the root directory as `doctortrack-client` (if in a monorepo or separate repo).
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` (set to your deployed backend URL, e.g. `https://doctortracker-api.onrender.com`)
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Click **Deploy**.
6. Once deployed, copy your live frontend URL and add it to the backend `CLIENT_URL` environment variable as well as Firebase authorized domains.
