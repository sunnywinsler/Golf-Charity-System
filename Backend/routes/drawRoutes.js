import express from "express";
import { executeDraw, getDrawHistory } from "../controllers/drawController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Normally you'd want an isAdmin middleware here
router.post("/execute", requireAuth, executeDraw);
router.get("/history", requireAuth, getDrawHistory);

export default router;
