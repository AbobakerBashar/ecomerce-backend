import Cart from "../models/cart.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

// Add Cart Item
export const addToCart = async (req, res) => {
	const { productId, quantity, variants } = req.body;
	const userId = req.userId;

	try {
		const product = await Product.findById(productId).select("_id");

		if (!product) {
			return res.status(404).json({
				success: false,
				message: `Product was not found`,
			});
		}

		let cart = await Cart.findOne({ user: userId });

		if (!cart) {
			cart = new Cart({
				user: userId,
				items: [],
			});
		}

		const existingItem = cart.items.find(
			(cartItem) =>
				cartItem.product.toString() === product._id.toString() &&
				cartItem.color === variants.color &&
				cartItem.size === variants.size,
		);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			cart.items.push({
				product: product._id,
				quantity: quantity,
				color: variants.color,
				size: variants.size,
			});
		}

		await cart.save();

		return res.status(200).json({
			success: true,
			cart,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Get All Cart Items
export const getCart = async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.userId })
			.select("items")
			.populate({
				path: "items.product",
				select: "name images price salePrice description brand",
			});
		if (!cart) return res.status(404).json({ message: "Cart not found" });

		const items = cart.items.map((item) => ({
			id: item._id,
			name: item.product.name,
			description: item.product.description,
			brand: item.product.brand,
			images: item.product.images,
			price: item.product.price,
			salePrice: item.product.salePrice,
			quantity: item.quantity,
			color: item.color,
			size: item.size,
		}));

		res.status(200).json({
			success: true,
			cart: { id: cart._id, items: items },
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// Get Cart Length
export const getCartItemCount = async (req, res) => {
	const userId = req.userId;
	try {
		const cart = await Cart.findOne({ user: userId }).select("items");

		if (!cart)
			return res.status(404).json({
				message: "Cart was not found",
				success: false,
			});

		const count = cart.items?.reduce((acc, item) => acc + item.quantity, 0);

		res.status(200).json({
			count,
			success: true,
		});
	} catch (error) {
		res.status.json({
			message: error.message,
			success: false,
		});
	}
};

// Delete Cart Item
export const deleteCartItem = async (req, res) => {
	const userId = req.userId;
	const itemId = req.params;

	if (!itemId || !mongoose.Types.ObjectId.isValid(itemId))
		return res.status(404).json({
			success: false,
			message: "Invalid product ID",
		});

	try {
		const cart = await Cart.findOne({ user: userId });

		if (!cart)
			return res.status(404).json({
				success: false,
				message: "Cart not found",
			});

		const item = cart.items.id(itemId);

		if (!item)
			return res.status(404).json({
				success: false,
				message: "Item not found",
			});

		item.deleteOne();

		await cart.save();

		res.status(200).json({
			success: true,
			cart,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Update Cart Item
export const updateCartItem = async (req, res) => {
	const itemId = req.params;
	const userId = req.userId;
	const { quantity } = req.body;

	if (!itemId || !mongoose.Types.ObjectId.isValid(itemId))
		return res.status(404).json({
			success: false,
			message: "Invalid product ID",
		});

	try {
		const cart = await Cart.findOne({ user: userId });

		if (!cart)
			return res.status(404).json({
				success: false,
				message: "Cart not found",
			});

		const item = cart.items.id(itemId);

		if (!item)
			return res.status(404).json({
				success: false,
				message: "Item not found",
			});

		item.quantity = quantity;

		await cart.save();

		res.status(200).json({
			success: true,
			cart,
		});
	} catch (error) {
		res.status(500).json({ message: error.message, success: false });
	}
};

// Clear Cart
export const clearCart = async (req, res) => {
	const userId = req.userId;
	try {
		const cart = await Cart.findOneAndDelete({ user: userId });
		if (!cart)
			return res.status(404).json({
				success: false,
				message: "No cart found",
			});
		res.status(201).json({
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
