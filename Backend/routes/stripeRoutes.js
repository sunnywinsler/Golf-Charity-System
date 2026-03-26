import express from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/stripeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", requireAuth, createCheckoutSession);

// Webhook must use express.raw() in index.js before this router receives it
router.post("/webhook", handleWebhook);

export default router;
