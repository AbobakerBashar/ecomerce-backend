import { Router } from "express";
import { getAllCategories, getCategoryById } from "../controllers/category.js";

const router = Router();

router.get("/", getAllCategories);

router.get("/", getCategoryById);

export default router;
