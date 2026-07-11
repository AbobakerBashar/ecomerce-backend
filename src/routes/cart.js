import { Router } from "express";
import {
	clearCart,
	deleteCartItem,
	getById,
	getCart,
	updateCartItem,
} from "../controllers/cart";

const router = Router();

// Get All Cart Items
router.get("/", getCart);

// Get By Id
router.get("/:id", getById);

// Update Cart Item
router.patch("/:id", updateCartItem);

// Delete Cart Item
router.delete("/:id", deleteCartItem);

// Clear Cart
router.delete("/", clearCart);
