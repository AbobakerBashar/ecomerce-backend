import { Router } from "express";
import { checkout } from "../controllers/checkout.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", auth, checkout);

export default router;
