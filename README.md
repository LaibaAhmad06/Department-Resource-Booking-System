# 📘 Department Resource Booking System

A **cloud-based full-stack web application** designed to streamline and automate the booking of departmental resources such as classrooms, labs, and equipment. The system ensures efficient scheduling, prevents conflicts, and provides a seamless experience for both users and administrators.

---

## 🚀 Features

### 👤 User Side (طلاب / Faculty)

* 📅 Book available resources (rooms, labs, equipment)
* ⏱️ Real-time availability checking
* ❌ Conflict-free scheduling system
* 📋 View booking history
* 🔔 Instant booking confirmation

### 🛠️ Admin Side

* 🧑‍💼 Manage users and roles
* 🏫 Add, update, or remove resources
* 📊 Monitor all bookings
* ⚙️ Approve or reject booking requests
* 📈 Maintain system integrity and availability

---

## 🏗️ System Architecture

This project follows a **cloud-native architecture** deployed on AWS:

* **Frontend:** React.js
* **Backend:** Node.js (Express.js)
* **Database:** Amazon DynamoDB (NoSQL)
* **Server Hosting:** AWS EC2
* **Process Manager:** PM2

### 📌 Key Design Highlights

* Scalable NoSQL database design using DynamoDB
* RESTful API architecture
* Separation of concerns (Frontend & Backend)
* Optimized for real-time operations

---

## 📂 Project Structure

```
AWS_project_SDC/
│
├── client/                 # React Frontend
│   ├── src/
│   └── public/
│
├── server/                 # Node.js Backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
│
├── docs/                   # Architecture diagrams / documentation
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔧 Prerequisites

* Node.js (v14+ recommended)
* npm or yarn
* AWS Account (for DynamoDB & EC2)

---

### 🖥️ After Cloning Repository


### 📦 Install Dependencies

#### For Backend:

```bash
cd server
npm install
```

#### For Frontend:

```bash
cd client
npm install
```

---

### ▶️ Run the Application

#### Start Backend:

```bash
cd server
npm start
```

#### Start Frontend:

```bash
cd client
npm start
```

---

## ☁️ Deployment (AWS)

### 🔹 EC2 Setup

* Launch EC2 instance (Ubuntu recommended)
* Install Node.js & npm
* Clone repository on EC2
* Run backend using PM2:

```bash
pm install -g pm2
pm start
pm2 start server.js
```

---

### 🔹 DynamoDB Configuration

* Create tables for:

  * Users
  * Resources
  * Bookings
* Configure AWS SDK in backend

---

## 🔐 Environment Variables

Create a `.env` file in the backend:

```
PORT=5000
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
DYNAMODB_TABLE=your_table_name
```

---

## 🧠 Key Concepts Used

* Full Stack Development
* REST API Design
* Cloud Computing (AWS EC2, DynamoDB)
* NoSQL Database Modeling
* Authentication & Authorization
* Real-time Data Handling

---

## 📌 Future Improvements

* 🔐 Implement JWT-based authentication
* 📱 Mobile responsiveness improvements
* 📊 Advanced analytics dashboard
* 🔔 Email/SMS notifications
* 🌐 Multi-department scalability

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## 👩‍💻 Author

**Laiba Ahmad**  & **Turab Hashmi**
Software Engineering Students @ ITU Lahore

---
