import { Router } from "express";
import {getAssignmentMetrics,runAssignment   } from '../controller/assignmentController.js'
const router = Router();

router.get('/metrics',getAssignmentMetrics);
router.post('/run',runAssignment );


export default router;
