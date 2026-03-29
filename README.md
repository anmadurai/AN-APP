# ALL MADURAI HOLINESS CHURCH - Full-Stack Website

A secure, premium church website built with React, Node.js, Express, and Supabase.

## 🚀 Features
- **Frontend:** Modern light theme with spiritual aesthetics.
- **Video System:** Embedded YouTube sermons with custom player.
- **Authentication:** Single-device login policy (prevents multiple logins).
- **Admin Dashboard:** Control users, sessions, and sermon content.
- **Secure Backend:** JWT auth with BCrypt hashing and Supabase DB.

---

## 🛠️ Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project in [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** in Supabase.
3. Paste the contents of `server/schema.sql` and run it to create the tables.

### 2. Backend Configuration
1. Navigate to the `server` folder.
2. Rename `.env.example` to `.env`.
3. Fill in the following variables:
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_KEY`: Your **service_role** key (needed for bypassing RLS in bypass mode).
   - `JWT_SECRET`: A string of at least 32 characters for signing tokens.
   - `CLIENT_URL`: The URL where your React app will run (usually `http://localhost:5173`).

### 3. Install Dependencies
```bash
# In the root directory
cd server && npm install
cd ../client_v2 && npm install
```

### 4. Seed Initial Admin
You cannot register publicly. You must seed the first admin user:
```bash
cd server
npm run seed -- admin mypassword123
```

### 5. Running the Application
```bash
# Start Backend
cd server && npm run dev

# Start Frontend (in a new terminal)
cd client_v2 && npm run dev
```

---

## 🔐 Security Features
- **Single Session Control:** If a user logs in on a new device, the old session's JWT will become invalid immediately as the `current_session_id` in the database is updated.
- **Admin Revocation:** Administrators can see who is "Active" and manually revoke their access from the dashboard.
- **No Registration:** Users can only be created by an administrator, ensuring only authorized members can access private areas.

## 📁 Project Structure
- `client_v2/`: React frontend with Vite.
- `server/`: Express backend with Supabase integration.
  - `src/routes/`: API endpoints for Auth, Users, and Videos.
  - `src/middleware/`: Auth validation and Session security.
  - `src/config/`: Supabase client initialization.

---

## 📦 Deployment Guide
### Frontend (Vercel)
1. Push the `client_v2` code (or move it to `client`).
2. Add environment variable `VITE_API_URL` pointing to your deployed backend.

### Backend (Render / Railway)
1. Deploy the `server` folder.
2. Ensure all `.env` variables are added to the environment configuration.
3. Ensure CORS is correctly set to your production frontend URL.
