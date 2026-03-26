import express from "express";
import { setCharity, getCharity } from "../controllers/charityController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/set", requireAuth, setCharity);
router.get("/", requireAuth, getCharity);

export default router;