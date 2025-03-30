import { Router } from "express";
import { getPartners, addPartner, updatePartner, deletePartner } from "../controller/deliveryPartnerController.js";

const router = Router();

router.get("/", getPartners);
router.post("/", addPartner);
router.put("/:id", updatePartner);
router.delete("/:id", deletePartner);

export default router;
