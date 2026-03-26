import express from "express";
import {
  setSubscription,
  getSubscription,
} from "../controllers/subscriptionController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/set", requireAuth, setSubscription);
router.get("/", requireAuth, getSubscription);

export default router;