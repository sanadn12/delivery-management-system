import { Request, Response } from "express";
import pool from "../config/db.js";

// GET /api/orders - Fetch all orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        o._id, 
        o.ordernumber AS "orderNumber",
        o.customer->>'name' AS "customerName",
        o.customer->>'phone' AS "customerPhone",
        o.customer->>'address' AS "customerAddress",
        o.items::json AS "items",
        o.area, 
        o.assignedto AS "assignedTo",
        o.status, 
        o.scheduledfor AS "scheduledFor",
        o.totalamount AS "totalAmount",
        o.createdat AS "createdAt",
        o.updatedat AS "updatedAt",
        p.id AS "partnerId",
        p.name AS "partnerName",
        p.phone AS "partnerPhone"
      FROM orders o
      LEFT JOIN partners p ON o.assignedto = p.id  
      ORDER BY o.createdat DESC
    `);

    res.status(200).json(result.rows);
  
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};



// POST /api/orders/assign - Assign an order to a delivery partner
export const assignOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, scheduledFor } = req.body; // Scheduled delivery time

    if (!orderId) {
      res.status(400).json({ message: "Order ID is required" });
      return;
    }

    // Check if order exists
    const orderQuery = await pool.query("SELECT * FROM orders WHERE _id = $1", [orderId]);
    if (orderQuery.rowCount === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const order = orderQuery.rows[0];

    // Find available partners considering area, shift, and active orders
    const partnerQuery = await pool.query(
      `SELECT * FROM partners 
       WHERE ($1 = ANY(areas) OR areas::text ILIKE '%' || $1 || '%')
       AND status = 'active'
       AND shiftstart <= $2
       AND shiftend >= $2
       ORDER BY currentLoad ASC
       LIMIT 1`,
      [order.area, scheduledFor]
    );

   // Backend assignOrder
if (partnerQuery.rowCount === 0) {
  res.status(400).json({
    message: "No available partners in this area or within the shift timings",
    reason: "No available partners", 
  });
  return;
}


    const partner = partnerQuery.rows[0];

    // Assign order to the selected partner
    await pool.query(
      "UPDATE orders SET assignedTo = $1, status = 'assigned', updatedAt = NOW() WHERE _id = $2",
      [partner.id, orderId]
    );

    // Increase partner's order load
    await pool.query(
      "UPDATE partners SET currentLoad = currentLoad + 1 WHERE id = $1",
      [partner.id]
    );

    res.status(200).json({
      message: "Order successfully auto-assigned",
      orderId,
      assignedTo: partner.id,
      partnerName: partner.name
    });

  } catch (error) {
    res.status(500).json({ message: "Error in auto-assigning order", error });
  }
};


// PUT /api/orders/[id]/status - Update order status
export const editOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, status, assignedTo } = req.body;

    if (!orderId || !status) {
      res.status(400).json({ message: "Order ID and status are required" });
      return;
    }

    // Fetch the order from the database
    const orderResult = await pool.query("SELECT * FROM orders WHERE _id = $1", [orderId]);
    if (orderResult.rows.length === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const order = orderResult.rows[0];
    const dbAssignedTo = order.assignedto;

    if (status === "picked") {
      if (!dbAssignedTo && assignedTo) {
        // Assign order to partner if not assigned
        await pool.query(
          "UPDATE orders SET assignedto = $1, status = 'picked', updatedat = NOW() WHERE _id = $2",
          [assignedTo, orderId]
        );

        // Increase current load for the assigned partner
        await pool.query("UPDATE partners SET currentload = currentload + 1 WHERE id = $1", [assignedTo]);
      } else if (dbAssignedTo && dbAssignedTo !== assignedTo) {
        res.status(400).json({ message: "Order is already assigned to another partner" });
        return;
      } else {
        // Update status if already assigned
        await pool.query("UPDATE orders SET status = 'picked', updatedat = NOW() WHERE _id = $1", [orderId]);
      }

      res.status(200).json({ message: "Order marked as picked successfully" });
      return;
    }

    if (status === "delivered") {
      await pool.query("UPDATE orders SET status = 'delivered', updatedat = NOW() WHERE _id = $1", [orderId]);

      if (dbAssignedTo) {

        const partnerResult = await pool.query(
          "SELECT id, COALESCE(completedorders, 0)::INTEGER AS completedorders, COALESCE(rating, 0) AS rating, COALESCE(currentload, 0)::INTEGER AS currentload FROM partners WHERE id = $1",
          [dbAssignedTo]
        );

        if (partnerResult.rows.length === 0) {
          res.status(404).json({ message: "Partner not found" });
          return;
        }

        const { completedorders, rating: currentRating, currentload } = partnerResult.rows[0];

        // Ensure completedOrders is a valid number
        const updatedCompletedOrders = completedorders + 1;

        // Auto-generate rating based on completed orders (default new rating = 5)
        const newRating = ((currentRating * completedorders) + 5) / updatedCompletedOrders;
        const updatedCurrentLoad = Math.max(0, currentload - 1);


        // Update partner's stats in the database, including current load
        const updateResult = await pool.query(
          "UPDATE partners SET completedorders = $1, rating = $2, currentload = $3 WHERE id = $4 RETURNING *",
          [updatedCompletedOrders, newRating, updatedCurrentLoad, dbAssignedTo]
        );

        if ((updateResult.rowCount ?? 0) > 0) {
        } else {
          console.log("Failed to update partner stats");
        }
      }

      res.status(200).json({ message: "Order delivered and partner stats updated successfully" });
      return;
    }

    res.status(400).json({ message: "Invalid status provided" });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};






export const addOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderNumber, customer, area, items, scheduledFor, totalAmount } = req.body;
  
      if (!orderNumber || !customer || !area || !items || !scheduledFor || !totalAmount) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
      const formattedTime = scheduledFor.split("T")[1]; // Extracts "HH:MM"

      const result = await pool.query(
        `INSERT INTO orders (orderNumber, customer, area, items, status, scheduledFor, totalAmount, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, 'pending', $5, $6, NOW(), NOW()) RETURNING _id`,
        [orderNumber, customer, area, JSON.stringify(items), formattedTime, totalAmount]
      );
      
  
      res.status(201).json({ message: "Order created successfully", orderId: result.rows[0]._id });
    } catch (error) {
      res.status(500).json({ message: "Error adding order", error });
      
    }
  };