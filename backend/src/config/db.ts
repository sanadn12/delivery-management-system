import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

// Use the connection string provided by Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Use the full connection string from Render
  ssl: {
    rejectUnauthorized: false, // Enable SSL for secure connections on Render
  }
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("PostgreSQL connection error:", err);
});

export default pool;
