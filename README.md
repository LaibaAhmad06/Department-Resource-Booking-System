# Department Resource Booking System

A full-stack web application designed to automate the reservation of institutional assets, deployed on Amazon Web Services (AWS) using a high-performance NoSQL architecture.

## 🚀 Overview

This system provides a digital solution to the common administrative challenges of manual resource booking. It streamlines the scheduling of classrooms, labs, and equipment, ensuring zero conflicts and real-time visibility for all department members.

## 🛠 Tech Stack

- **Frontend:** React.js (hosted on EC2)  
- **Backend:** Node.js & Express.js (hosted on EC2)  
- **Database:** Amazon DynamoDB (NoSQL)  
- **Process Management:** PM2 (Process Manager 2)  
- **Environment:** TypeScript (using ts-node)

## 🏗 Deployment Architecture

The system is optimized for a cloud-native environment with the following configuration:

- **Unified EC2 Hosting:**  
  Both the React frontend (Port 3000) and the Express backend (Port 5000) are hosted on a single Amazon EC2 instance, providing cost-efficiency and simplified network management.

- **DynamoDB Integration:**  
  Unlike traditional relational databases, Amazon DynamoDB is used for rapid data retrieval, ensuring the system can handle concurrent booking requests with minimal latency.

- **Security & Access Control:**  
  Access is restricted via AWS Security Groups allowing inbound traffic only on essential ports (3000, 5000, and 22 for SSH).

- **PM2 Resilience:**  
  PM2 is used to keep both frontend and backend services alive, ensuring automatic restarts in case of system failures or instance reboots.

## ✨ Key Features

- **Role-Based Access Control:**  
  Separate dashboards for Admins (resource management) and Users (resource booking).

- **Domain Restriction:**  
  Secure registration and login restricted exclusively to `@itu.edu.pk` email addresses.

- **Conflict Detection:**  
  Intelligent backend logic prevents multiple users from booking the same resource for overlapping time slots.


# 🚀 Running on EC2

### Backend Setup

Navigate to the backend directory:

```cd ~/AWS_project_SDC/backend ```

Start the server using PM2 with the ESM loader:


```pm2 start "npx tsx server.ts" --name "backend"```



### Frontend Setup

Navigate to the frontend directory:

```cd ~/AWS_project_SDC/frontend```

Start the Vite development server:

```pm2 start "npm run dev -- --host" --name "frontend"```



## Testing Strategy and Verification

To test both the backend and frontend, we used a combination of manual and automated methods to ensure that both servers are functioning correctly and are accessible over the internet.


- **1. Backend Testing (API Verification)**  

Multiple stages were used to test the backend:

Process Monitoring:
The pm2 list command was used to verify that the backend service is in an Online state and that its memory usage average (e.g., 90.4 MB) remains within normal limits.

Local Connectivity:
The backend server’s ability to accept requests was tested by running
curl ```http://localhost:5000/api/auth/login```
in the terminal.

Public Access:
Direct access was tested by entering the public IP in the browser
```(http://3.213.38.136:5000/api/resources)```
to confirm that the AWS Security Group allows external connections.

Log Analysis:
Runtime errors (such as ```ERR_UNKNOWN_FILE_EXTENSION```) were identified and resolved using pm2 logs backend.


- **2. Frontend Testing (UI & Integration)**  

The following steps were taken to test the frontend:

Deployment Check:
The pm2 list command was used to confirm that the frontend server is online and running on port 3000.

Service Binding:
The backend IP address (3.213.38.136) was updated in ```frontend/src/services/api.ts``` to ensure proper communication between the frontend and backend.

Browser Console:
The browser’s Inspect Element → Console tab was used to track errors such as ```net::ERR_CONNECTION_REFUSED```, helping identify blocked or failed connections.


- **3. Integration & Security Testing**  

To test both systems together:

AWS Security Groups:
Inbound rules for both launch-wizard-1 and ITU-Security-Group were reviewed to ensure that traffic is allowed on ports 3000 (Frontend) and 5000 (Backend).

End-to-End Login Testing:
Login credentials were entered into the live application to verify the authentication flow, including logic in auth.ts.