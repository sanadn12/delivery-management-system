import { Router } from "express";
import {getOrders,assignOrder,editOrder,addOrder } from '../controller/orderController.js'
const router = Router();


router.get("/", getOrders);
router.post("/assign", assignOrder);
router.put("/:id/status", editOrder);
router.post("/",addOrder);

export default router;
