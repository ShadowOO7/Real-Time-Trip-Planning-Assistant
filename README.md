# Real-Time Trip Planner

A collaborative **real-time travel planning assistant** built with the **MERN stack (MongoDB, Express, React, Node.js)**, featuring group itineraries, live updates, and integrated travel tools.

---

## 🚀 Features

### 🌍 Core Features
- **Real-Time Itinerary Building**: Collaboratively add/edit destinations, accommodations, and activities with instant sync via **Socket.IO**.
- **OpenStreetMap Integration**: Interactive maps without relying on Google Maps APIs.
- **Group Travel Optimization**: AI-based optimization (Python/Node.js service) using algorithms like **Dijkstra/Genetic Algorithm** to minimize cost and time.

### 🔐 User System
- **Login/Logout** with JWT authentication.
- **Invite Friends to Trips** – create a trip, invite members, and collaborate.

### 🏠 Home Page
- **Slideshow** of beautiful images (mountains, valleys, rivers, hills, cities).

### ℹ️ About Page
- Displays project information including:
  - Owner: **Shekhar Nayak**
  - Dummy License Number: `ABC-123456`
  - Contact Email: `shekharnayak.dev@example.com`

### 👥 Trip Collaboration
- **Trip Creation & Management** – set trip name and invite friends.
- **Group Chat Section** – real-time communication during planning.
- **Visited & Next Destination Tracking** – update destinations as you travel.

### 🤖 AI Suggestions
- **AI Travel Assistant** that suggests **10 best places to visit** around your next destination.

---

## 🛠️ Tech Stack
- **Frontend**: React, TailwindCSS, Socket.IO Client, React Router
- **Backend**: Node.js, Express.js, Socket.IO, JWT Auth
- **Database**: MongoDB Atlas (via Mongoose)
- **Map**: OpenStreetMap (Leaflet.js)
- **AI Service**: Python/Node.js microservice for recommendations

---

## 📂 Project Structure
```
realtime-trip-planner/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Slideshow, Chat, Suggestions, Trip features
│   │   ├── pages/           # Home, About, Login, Trips
│   │   └── App.js
├── server/                  # Express backend
│   ├── src/
│   │   ├── models/          # User, Trip, Message models (Mongoose)
│   │   ├── routes/          # Auth, Trip, Suggestion routes
│   │   ├── sockets/         # Real-time chat and trip updates
│   │   └── server.js
├── .env                     # Environment variables
├── README.md
└── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/your-username/realtime-trip-planner.git
cd realtime-trip-planner
```

### 2️⃣ Install Dependencies
```bash
# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in `/server` with:
```env
PORT=4000
MONGODB_URI="your-mongodb-atlas-uri"
JWT_SECRET="your-secret-key"
CORS_ORIGINS="http://localhost:3000"
```

### 4️⃣ Run the App
```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
```

### 5️⃣ Deployment
- Deploy backend on **Render/Fly.io**
- Deploy frontend on **Vercel/Netlify**
- Use **MongoDB Atlas** for free cloud database.

---

## 📧 Contact
**Owner**: Shekhar Nayak  
**Email**: shekharnayak.dev@example.com  
**License**: Dummy License No. `ABC-123456`
