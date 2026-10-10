# Simple Task Tracker (MERN Stack)

> An educational, beginner-friendly full-stack web application designed for a college viva presentation. Built with clear separation of concerns, plain CSS, native `fetch`, and strict user privacy.

---

## 📖 Table of Contents
1. [Project Purpose](#project-purpose)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Setup & Installation Guide](#setup--installation-guide)
   - [Prerequisites](#prerequisites)
   - [MongoDB Setup (Local vs. Atlas)](#mongodb-setup-local-vs-atlas)
   - [Environment Variables (.env)](#environment-variables-env)
   - [Running the Backend](#running-the-backend)
   - [Running the Frontend](#running-the-frontend)
6. [API Route Reference](#api-route-reference)
7. [How Authentication Works (Viva Guide)](#how-authentication-works-viva-guide)
8. [How the MERN Architecture Communicates](#how-the-mern-architecture-communicates)
9. [Automated Verification Suite](#automated-verification-suite)

---

## 🎯 Project Purpose

The **Simple Task Tracker** was created to demonstrate a clean, robust, and explainable **MERN stack** (MongoDB, Express, React, Node.js) web application.

- **No bloated libraries**: Uses vanilla CSS, the browser's native `fetch` API, and straightforward `localStorage` token storage.
- **Strict Privacy**: A user can only see, create, edit, or delete their own tasks.
- **Viva-Ready**: Every line of code is written in a direct, easy-to-defend manner without confusing abstractions.

---

## ✨ Key Features

- **User Authentication**:
  - Secure account registration with email format validation and password minimum length checks.
  - Secure login with bcrypt password comparison.
  - JWT (JSON Web Token) issuance with a 7-day expiration.
  - One-click logout that clears local credentials.
- **Task Management (CRUD)**:
  - **Create**: Add a task with title, description, priority (`Low`, `Medium`, `High`), category (`College`, `Personal`, `Work`, `Other`), and due date.
  - **Read**: View all personal tasks in card format.
  - **Update**: Edit task details seamlessly or mark tasks complete/pending via checkbox.
  - **Delete**: Remove a task with a confirmation dialog.
- **Interactive Dashboard**:
  - Real-time statistics counter: **Total Tasks**, **Completed**, and **Pending**.
  - **Live Search**: Instant title filter.
  - **Category & Priority Filters**: Quickly filter by tag.
  - **Status Filter**: View all, pending only, or completed only.
  - **Sorting**: Order tasks by due date (Soonest first, Latest first, or Newest created).
- **Responsive & Accessible Design**:
  - Color-coded badges for priority and category.
  - Distinct styling for completed tasks (line-through title, muted background).
  - Clean CSS variables for easy re-theming.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React (Vite) | Declarative user interface |
| **Routing** | `react-router-dom` | Page navigation between Login, Register, Dashboard |
| **Styling** | Plain CSS (`index.css`) | Themeable with CSS variables, mobile-responsive |
| **HTTP Client** | Browser Native `fetch` | No third-party Axios dependency |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB + Mongoose | Document storage and schema validation |
| **Security** | `bcryptjs` + `jsonwebtoken` | Password hashing & stateless token authentication |
| **Dev Tools** | `nodemon` (backend), Vite (frontend) | Hot reloading during development |

---

## 📂 Folder Structure

```text
simple-task-tracker/
├── client/                      # Frontend React application
│   ├── index.html               # Main HTML entrypoint
│   ├── package.json             # Frontend dependencies (React, Router, Vite)
│   ├── vite.config.js           # Vite dev config with /api proxy
│   └── src/
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.jsx       # Brand, user greeting & logout button
│       │   ├── TaskForm.jsx     # Add and edit task form
│       │   ├── TaskList.jsx     # Container for task items with empty states
│       │   ├── TaskItem.jsx     # Individual task card with actions
│       │   ├── TaskFilters.jsx  # Search, filter, and sorting controls
│       │   └── TaskStats.jsx    # Total, completed, and pending counters
│       ├── pages/               # Route views
│       │   ├── Login.jsx        # Login page
│       │   ├── Register.jsx     # Registration page
│       │   └── Dashboard.jsx    # Main task management dashboard
│       ├── services/            # API communication layer
│       │   ├── authService.js   # Fetch calls for register/login & localStorage
│       │   └── taskService.js   # Fetch calls for task CRUD with Bearer token
│       ├── App.jsx              # Main routing & auth state wrapper
│       ├── main.jsx             # React DOM root render
│       └── index.css            # Global CSS variables & styles
├── server/                      # Backend Express application
│   ├── config/
│   │   └── db.js                # Mongoose database connection helper
│   ├── controllers/             # Business logic handlers
│   │   ├── authController.js    # Register & Login controllers
│   │   └── taskController.js    # Task CRUD & ownership enforcement
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT token verification middleware
│   ├── models/                  # Mongoose database schemas
│   │   ├── User.js              # User schema (name, email, password)
│   │   └── Task.js              # Task schema (title, priority, user ref, etc.)
│   ├── routes/                  # Express route definitions
│   │   ├── authRoutes.js        # /api/auth routes
│   │   └── taskRoutes.js        # /api/tasks routes
│   ├── .env                     # Private environment configuration
│   ├── .env.example             # Template for environment variables
│   ├── package.json             # Backend dependencies
│   ├── server.js                # Express server entrypoint
│   └── test-api.js              # Standalone automated API test script
├── .gitignore                   # Ignores node_modules and .env
├── README.md                    # Main project documentation (this file)
├── HOW_THIS_PROJECT_WORKS.md    # Viva guide explaining communication flows
├── IMPORTANT_FILES.md           # Quick summary of key files
└── CUSTOMIZATION_IDEAS.md       # Ideas for project enhancements
```

---

## 🚀 Setup & Installation Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally or a free MongoDB Atlas cloud cluster)

---

### MongoDB Setup (Local vs. Atlas)

#### Option A: Local MongoDB (Default)
If you have MongoDB installed locally (e.g. MongoDB Community Server on Windows):
1. Verify the MongoDB service is running (in PowerShell: `Get-Service -Name "*mongo*"`).
2. The default connection URI in `.env` is:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/task-tracker
   ```

#### Option B: Free MongoDB Atlas Cloud Cluster
If you do not have MongoDB installed on your computer, use MongoDB Atlas for free:
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Click **Build a Database** and select the **M0 Free Shared Tier**.
3. Under **Security Quickstart**:
   - Create a database user (e.g., username: `taskadmin`, password: `yourpassword123`).
   - Add IP Access: Click **Add Current IP Address** or allow access from anywhere (`0.0.0.0/0`).
4. Click **Connect** -> **Drivers** (Node.js).
5. Copy the connection string. It looks like:
   ```
   mongodb+srv://taskadmin:<password>@cluster0.abcde.mongodb.net/task-tracker?retryWrites=true&w=majority
   ```
6. Paste this string into your `server/.env` file for `MONGO_URI`.

---

### Environment Variables (.env)
In `server/.env`, ensure the following values are defined:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-tracker
JWT_SECRET=super_secret_jwt_key_for_college_project_change_in_production
```

---

### Running the Backend

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
   *(On Windows PowerShell, use `npm.cmd install` if script execution policies apply).*
3. Start the server:
   - For standard start:
     ```bash
     npm start
     ```
   - For development auto-restart:
     ```bash
     npm run dev
     ```
4. Output should display:
   ```
   Server running on port 5000
   MongoDB Connected: 127.0.0.1
   ```

---

### Running the Frontend

1. Open a second terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
   *(On Windows PowerShell, use `npm.cmd install`)*
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📡 API Route Reference

All routes return standard JSON responses and status codes: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`.

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth? | Body | Success Response |
|---|---|---|:---:|---|---|
| `POST` | `/api/auth/register` | Create a new user account | No | `{ name, email, password }` | `201 Created` `{ token, user }` |
| `POST` | `/api/auth/login` | Authenticate existing user | No | `{ email, password }` | `200 OK` `{ token, user }` |

### Task Endpoints (`/api/tasks`)

> **Note**: All task endpoints require the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description | Auth? | Body | Success Response |
|---|---|---|:---:|---|---|
| `GET` | `/api/tasks` | Get all tasks of the logged-in user | Yes | None | `200 OK` `[ task1, task2, ... ]` |
| `POST` | `/api/tasks` | Create a new task | Yes | `{ title, description?, priority?, category?, dueDate? }` | `201 Created` `{ task }` |
| `PUT` | `/api/tasks/:id` | Update task or toggle complete | Yes | `{ title?, description?, priority?, category?, dueDate?, completed? }` | `200 OK` `{ task }` |
| `DELETE`| `/api/tasks/:id` | Delete a specific task | Yes | None | `200 OK` `{ message: "Task deleted successfully" }` |

---

## 🔐 How Authentication Works (Viva Guide)

In a viva examination, the examiner will often ask: *"How does authentication work in your application?"* Here is the clear, exact explanation:

1. **Password Hashing (Registration)**:
   - Plain-text passwords are never stored in the database.
   - When a user registers, the server generates a random cryptographic salt using `bcrypt.genSalt(10)`.
   - The password is then hashed via `bcrypt.hash(password, salt)`.
   - Only the irreversible hashed string is stored in MongoDB.
2. **Password Verification (Login)**:
   - When logging in, the user provides their email and password.
   - The server retrieves the user document by email.
   - It runs `bcrypt.compare(enteredPassword, storedHash)`. If the hash matches, authentication succeeds.
3. **Stateless JWT Tokens**:
   - The server signs a JSON Web Token using `jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })`.
   - The token is sent to the client and stored in `localStorage`.
   - The server does not maintain server-side session memory, making it completely stateless and lightweight.
4. **Protected Requests (`authMiddleware.js`)**:
   - For every protected API request, the browser includes the token in the header: `Authorization: Bearer <token>`.
   - Express runs `jwt.verify(token, JWT_SECRET)`.
   - If valid, `req.user` is populated with the user's ID, which is then used to safely query or assign tasks.

---

## 🔄 How the MERN Architecture Communicates

```
[ Browser / React ]  <--- (HTTP JSON / fetch) --->  [ Node / Express Server ]  <--- (Mongoose Driver) --->  [ MongoDB ]
```

1. **User Action**: The user fills a form in React (e.g., creates a task) and clicks submit.
2. **Frontend Service**: React invokes `taskService.createTask(taskData)` using native `fetch` with the `Authorization` header.
3. **Express Middleware**: Express receives the request. The `protect` middleware decodes the JWT and validates the user.
4. **Controller Logic**: `taskController.createTask` takes `req.user.id` from the decoded token (never trusting the request body) and validates the fields.
5. **Mongoose Database Query**: Mongoose sends an `insert` command to MongoDB.
6. **Response & State Update**: MongoDB returns the saved document to Express, Express returns JSON with status `201` to React, and React updates its state (`setTasks([created, ...prev])`), immediately re-rendering the UI without reloading the page.

---

## 🧪 Automated Verification Suite

To verify all backend functionality (registration, duplicate rejection, login, bad passwords, validation, CRUD operations, and cross-user privacy isolation), run the automated test script:

```bash
cd server
npm test
```
*(Or `node test-api.js`)*

The test script runs 18 distinct test scenarios and logs the results clearly to the console.
