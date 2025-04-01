# Smart Delivery Management System

## Overview
A modern delivery management dashboard focusing on **partner management** and **smart order assignments**.

## 🚀 Deliverables
1. **GitHub Repository**
2. **Working Demo**
3. **README Documentation**
4. **API Documentation**

## 📁 Project Structure
```
frontend/
│── .next/                  # Build output directory
│── node_modules/           # Dependencies
│── public/                 # Static assets
│── src/
│   ├── app/                # Next.js app router
│   │   ├── assignments/    # Assignment dashboard
│   │   ├── orders/         # Order management
│   │   ├── partners/       # Partner management
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Layout file
│   │   ├── page.tsx        # Main page
│   ├── components/         # Reusable UI components
│   │   ├── assignments/    # Assignment components
│   │   ├── navbar/         # Navigation bar
│   │   ├── orders/         # Order components
│   │   ├── partners/       # Partner components
│── .env                    # Environment variables
│── dockerfile              # Docker configuration
│── eslint.config.mjs       # ESLint configuration
│── next-env.d.ts           # TypeScript environment settings
│── next.config.ts          # Next.js configuration
│── package-lock.json       # Dependency lockfile
│── package.json            # Project metadata and dependencies
│── postcss.config.mjs      # PostCSS configuration
│── README.md               # Project documentation
│── tsconfig.json           # TypeScript configuration
│── .gitignore              # Git ignore file
```

## 📜 Data Types
```ts
type DeliveryPartner = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  currentLoad: number; // max: 3
  areas: string[];
  shift: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
}

type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string; // HH:mm
  assignedTo?: string; // partner ID
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

type Assignment = {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
}

type AssignmentMetrics = {
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: {
    reason: string;
    count: number;
  }[];
}
```

## 🌟 Required Features
### 1. Partner Management
- Partner registration form
- Partner list view
- Profile editing
- Area management
- Shift scheduling

### 2. Order Processing
- Orders dashboard
- Status tracking
- Assignment history
- Performance metrics

### 3. Assignment System
- Automated order assignments
- Success and failure tracking

## 📌 Required Pages
### **Dashboard (`/`)
- Key metrics cards
- Active orders map
- Partner availability status
- Recent assignments

### **Partners (`/partners`)
```ts
type PartnersPageProps = {
  partners: DeliveryPartner[];
  metrics: {
    totalActive: number;
    avgRating: number;
    topAreas: string[];
  };
}
```

### **Orders (`/orders`)
```ts
type OrdersPageProps = {
  orders: Order[];
  filters: {
    status: string[];
    areas: string[];
    date: string;
  };
}
```

### **Assignment Dashboard (`/assignments`)
```ts
type AssignmentPageProps = {
  activeAssignments: Assignment[];
  metrics: AssignmentMetrics;
  partners: {
    available: number;
    busy: number;
    offline: number;
  };
}
```

## 🔌 API Routes
### **Partner Routes**
```
GET /api/partners
POST /api/partners
PUT /api/partners/[id]
DELETE /api/partners/[id]
```

### **Order Routes**
```
GET /api/orders
POST /api/orders/assign
PUT /api/orders/[id]/status
```

### **Assignment Routes**
```
GET /api/assignments/metrics
POST /api/assignments/run
```

## 🎯 Evaluation Criteria
1. **TypeScript Implementation**
2. **Component Organization**
3. **State Management**
4. **Error Handling**
5. **Loading States**
6. **Mobile Responsiveness**
7. **Assignment Algorithm Efficiency**

## 🔧 Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --force
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:3000`.

## 🐳 Running with Docker
1. Build the Docker image:
   ```bash
   docker build -t frontend-app .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 frontend-app
   ```

## 📜 Environment Variables
Create a `.env` file in the root directory and add the required environment variables.

## 📌 Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m "Added new feature"`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.

## 📄 License
This project is licensed under the **MIT License**.

---
🚀 Happy Coding!

