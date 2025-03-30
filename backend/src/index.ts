import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import deliverPartnerRoutes from '../src/routes/deliveryPartnerRoutes.js';
import orderRoutes from '../src/routes/orderRoutes.js';
import assignmentRoutes from '../src/routes/assignmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6002;

app.use(cors({
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
}));
app.use(express.json());

app.use('/api/deliveryPartner',deliverPartnerRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/assignments',assignmentRoutes);

async function checkDBConnection() {
  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
  }
}

checkDBConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
