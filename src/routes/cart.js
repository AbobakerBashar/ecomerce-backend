import { Router } from "express";
import {
	addToCart,
	getCart,
	updateCartItem,
	deleteCartItem,
	clearCart,
	getCartItemCount,
} from "../controllers/cart.js";
import { cartValidation, updateCartValidation } from "../validators/cart.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// Add Items to the Cart
router.post("/", cartValidation, validate, auth, addToCart);

// Get All Cart Items
router.get("/", auth, getCart);

// Get Cart Length
router.get("/count", auth, getCartItemCount);

// Update Cart Item
router.patch("/:id", updateCartValidation, validate, auth, updateCartItem);

// Delete Cart Item
router.delete("/:id", auth, deleteCartItem);

// Clear Cart
router.delete("/", auth, clearCart);

export default router;
