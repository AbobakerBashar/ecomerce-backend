import { Router } from "express";
import {
	getOrder,
	getAllOrders,
	getTotalOrders,
} from "../controllers/orders.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/total", auth, getTotalOrders);
router.get("/:session_id", auth, getOrder);
router.get("/", auth, getAllOrders);

export default router;
