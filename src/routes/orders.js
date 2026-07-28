import { Router } from "express";
import {
	getOrder,
	getAllOrders,
	getOrderStats,
} from "../controllers/orders.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/status", auth, getOrderStats);
router.get("/:session_id", auth, getOrder);
router.get("/", auth, getAllOrders);

export default router;
