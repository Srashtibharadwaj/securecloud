# securecloud
SecureCloud  fullstack stack authentication system with JWT and MongoDB.
## 🏗️ Project Architecture

SecureCloud follows a simple **Client–Server Architecture**:

### 1) Frontend (Client)
- Built with **React (Vite)**
- UI pages: Register, Login, Dashboard
- Uses **Axios** to call backend APIs
- Stores JWT token (for login session)

### 2) Backend (Server)
- Built with **Node.js + Express**
- Provides REST APIs:
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/user/profile` (protected)
- Uses middleware to validate JWT token

### 3) Database
- **MongoDB Atlas**
- Stores user details:
  - name, email, hashed password, role (user/admin)

### 🔁 Flow (How it works)
1. User fills Register/Login form in frontend
2. Frontend sends request to backend API
3. Backend validates input + checks MongoDB
4. If login success → backend returns **JWT token**
5. Frontend saves token and shows dashboard
6. For protected routes, token is sent in headers:
   `Authorization: Bearer <token>`
