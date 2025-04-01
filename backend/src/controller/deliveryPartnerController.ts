import { Request, Response } from "express";
import pool from "../config/db.js"; 

import moment from "moment-timezone";
export const getPartners = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT id, name, email, areas, shiftstart, shiftend, phone,currentload, rating, completedorders, status FROM partners");

    const currentTime = moment().tz('Asia/Kolkata');


    const partners = result.rows.map((partner) => {
      const shiftStart = moment(partner.shiftstart, 'HH:mm');
      const shiftEnd = moment(partner.shiftend, 'HH:mm');
      let status = partner.status;

      if (currentTime.isBetween(shiftStart, shiftEnd, null, '[]')) {
        status = "active"; // Partner is active during this time
      } else {
        status = "inactive"; // Partner is inactive if outside shift time
      }

      return {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        status: status,
        rating: partner.rating,
        shiftStart: partner.shiftstart,
        shiftEnd: partner.shiftend,
        areas: partner.areas,
      };
    });

    for (let partner of partners) {
      if (partner.status !== result.rows.find((p) => p.id === partner.id)?.status) {
        await pool.query("UPDATE partners SET status = $1 WHERE id = $2", [partner.status, partner.id]);
      }
    }

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching and updating partners", error });

  }
};





export const addPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;

    const result = await pool.query(
      "INSERT INTO partners (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
      [name, email, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding partner", error });
  }
};

export const updatePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id || req.body.id || req.body._id;
    const updates = req.body; // Accept any updatable fields

    // Fetch existing partner to retain old values
    const existing = await pool.query("SELECT * FROM partners WHERE id = $1", [id]);

    if (existing.rowCount === 0) {
      res.status(404).json({ message: "Partner not found" });
      return;
    }

    // Ensure areas is an array
    if (updates.areas && !Array.isArray(updates.areas)) {
      res.status(400).json({ message: "Areas should be an array" });
      return;
    }

    // Ensure shift is an object with start & end
    if (updates.shift) {
      if (
        typeof updates.shift !== "object" ||
        !updates.shift.start ||
        !updates.shift.end
      ) {
        res.status(400).json({ message: "Shift should be an object with start and end time" });
        return;
      }
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Process normal fields except shiftstart and shiftend (to avoid duplicate updates)
    Object.keys(updates).forEach((field) => {
      if (field !== "shift" && field !== "shiftstart" && field !== "shiftend") {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    });

    // Handle shift separately (only once)
    if (updates.shift) {
      if (!updates.shiftstart && !updates.shiftend) {
        setClauses.push(`shiftstart = $${paramIndex}`, `shiftend = $${paramIndex + 1}`);
        values.push(updates.shift.start, updates.shift.end);
        paramIndex += 2;
      }
    }

    // If no valid fields to update, return an error
    if (setClauses.length === 0) {
      res.status(400).json({ message: "No fields to update" });
      return;
    }

    // Append the id to the values array
    values.push(id);

    // Construct the final query
    const query = `UPDATE partners SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;

    const result = await pool.query(query, values);

    res.status(200).json({ message: "Partner updated successfully", partner: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error updating partner", error });
  }
};




  

export const deletePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM partners WHERE id=$1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Partner not found" });
      return;
    }

    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting partner", error });
  }
};
