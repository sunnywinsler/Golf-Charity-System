import express from "express";
import { addScore, getScores } from "../controllers/scoreController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", requireAuth, addScore);
router.get("/", requireAuth, getScores);

export default router;