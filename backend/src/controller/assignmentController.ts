import { Request, Response } from "express";
import pool from "../config/db.js";

// Run assignment for an order
export const runAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, partnerId, status, reason } = req.body;
    
    if (!orderId || !status) {
      res.status(400).json({ message: "Order ID and status are required" });
      return;
    }

    const orderExists = await pool.query("SELECT * FROM orders WHERE _id = $1", [orderId]);
    if (orderExists.rowCount === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Insert assignment log (partnerId can be null)
    const assignmentResult = await pool.query(
      `INSERT INTO assignments (orderId, partnerId, timestamp, status, reason) 
       VALUES ($1, $2::integer, NOW(), $3, $4) RETURNING *`, // Cast partnerId as integer
      [orderId, partnerId || null, status, reason || null]
    );
    
    

    res.status(201).json({ message: "Assignment logged successfully", assignment: assignmentResult.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error logging assignment", error });
  }
};






// Get assignment metrics (total assigned, success rate, etc.)
export const getAssignmentMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Calculate total assignments
    const totalAssignedResult = await pool.query("SELECT COUNT(*) FROM assignments");
    const totalAssigned = Number(totalAssignedResult.rows[0].count);

    // Fetch partners data
    const totalActiveResult = await pool.query("SELECT COUNT(*) FROM partners WHERE status = 'active'");
    const totalActive = Number(totalActiveResult.rows[0].count); // Ensure it's a number

    const avgRatingResult = await pool.query("SELECT AVG(rating) FROM partners");
    const avgRating = avgRatingResult.rows[0].avg ? parseFloat(avgRatingResult.rows[0].avg) : 0; // Handle null values

    const topAreasResult = await pool.query("SELECT areas, COUNT(*) AS count FROM partners GROUP BY areas ORDER BY count DESC LIMIT 5");
    const topAreas = topAreasResult.rows.flatMap(row => {
      if (Array.isArray(row.areas)) {
        return row.areas; // If areas is an array, return it as is
      } else if (typeof row.areas === 'string' && row.areas !== null) {
        // Split string areas and trim any spaces
        const splitAreas = row.areas.split(',').map((area: string) => area.trim());
        return splitAreas;
      }
      return []; // Return an empty array if areas is null, undefined, or unprocessable
    });

    // Calculate success rate
    const successRateResult = await pool.query("SELECT COUNT(*) FROM assignments WHERE status = 'success'");
    const successRate = totalAssigned > 0 ? (parseInt(successRateResult.rows[0].count, 10) / totalAssigned) * 100 : 0;

    // Calculate average time (time from order assignment to completion)
    const avgTimeResult = await pool.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (timestamp - createdAt))) AS avg_time
      FROM assignments
      JOIN orders ON assignments.orderId = orders._id
      WHERE assignments.status = 'success'
    `);
    const averageTime = parseFloat(avgTimeResult.rows[0].avg_time) || 0; // Handle null/undefined

    // Calculate failure reasons
    const failureReasonsResult = await pool.query(`
      SELECT reason, COUNT(*) AS count
      FROM assignments
      WHERE status = 'failed'
      GROUP BY reason
    `);
    const failureReasons = failureReasonsResult.rows.map(row => ({
      reason: row.reason,
      count: parseInt(row.count, 10),
    }));

    // Fetch assignments with order details
    const assignmentsWithOrderDetailsResult = await pool.query(`
      SELECT 
        a.orderId, 
        a.partnerId, 
        a.timestamp, 
        a.status AS assignment_status, 
        a.reason, 
        o.status AS order_status,
        o.customer->>'name' AS customer_name, 
        o.customer->>'address' AS customer_address
      FROM assignments a
      JOIN orders o ON a.orderId = o._id
      WHERE a.status IN ('success', 'failed')
    `);
    

    const assignmentsWithOrderDetails = assignmentsWithOrderDetailsResult.rows.map(row => ({
      orderId: row.orderId,
      partnerId: row.partnerId,
      timestamp: row.timestamp,
      assignmentStatus: row.assignment_status,
      reason: row.reason,
      orderStatus: row.order_status,
      customerName: row.customername,
      deliveryAddress: row.deliveryaddress,
    }));

    // Fetch available partners
    const availablePartnersResult = await pool.query(`
      SELECT COUNT(*) 
      FROM partners p
      LEFT JOIN assignments a ON p.id = a.partnerId
      WHERE p.status = 'active' AND a.partnerId IS NULL
    `);
    const availablePartners = Number(availablePartnersResult.rows[0].count);

    // Fetch busy partners
    const busyPartnersResult = await pool.query(`
      SELECT COUNT(DISTINCT a.partnerId)
      FROM assignments a
      WHERE a.status IN ('assigned', 'picked')
    `);
    const busyPartners = Number(busyPartnersResult.rows[0].count);

    // Fetch offline partners
    const offlinePartnersResult = await pool.query(`
      SELECT COUNT(*)
      FROM partners
      WHERE status = 'inactive'
    `);
    const offlinePartners = Number(offlinePartnersResult.rows[0].count);

    // Return metrics
    const metrics = {
      totalActive,
      avgRating,
      topAreas,
      totalAssigned,
      successRate,
      averageTime,
      failureReasons,
      availablePartners,
      busyPartners,
      offlinePartners,
      assignmentsWithOrderDetails, // Include the assignments with order details
    };

    // Ensure metrics data exists before sending response
    if (!metrics || Object.values(metrics).some(value => value === undefined)) {
      throw new Error("Metrics data is missing or incomplete.");
    }

    res.status(200).json(metrics);

  } catch (error: unknown) {
    // Assert error as an instance of Error
    const err = error instanceof Error ? error : new Error('Unknown error');
    res.status(500).json({ message: "Error fetching assignment metrics", error: err.message });
  }
};
