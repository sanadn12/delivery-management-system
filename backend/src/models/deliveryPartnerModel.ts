import { Pool } from "pg";
import pool from "../config/db.js";

export type DeliveryPartner = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  currentLoad: number; 
  areas: string[];
  shiftStart: string; 
  shiftEnd: string;
  rating: number;
  completedOrders: number;
  cancelledOrders: number;
};

