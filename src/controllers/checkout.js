import dotenv from "dotenv";
dotenv.config();

import Cart from "../models/cart.js";
import { stripeClient } from "../config/stripe.js";

export const checkout = async (req, res) => {
	const address = req.body;

	try {
		const cart = await Cart.findOne({ user: req.userId })
			.select("items")
			.populate({
				path: "items.product",
				select: "name price salePrice stock",
			});

		if (!cart || cart.items.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Your cart is empty",
			});
		}

		for (const item of cart.items) {
			if (!item.product) {
				return res.status(400).json({
					success: false,
					message: "The item of the products in your cart no longer exists.",
				});
			}

			if (item.quantity > item.product.stock) {
				return res.status(400).json({
					success: false,
					message:
						item.product.stock === 0
							? `${item.product.name} is out of stock.`
							: `${item.product.name} only has ${item.product.stock} item(s) remaining.`,
				});
			}
		}

		const line_items = cart.items.map((item) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: item.product.name,
				},
				unit_amount: Math.round(
					(item.product.salePrice || item.product.price) * 100,
				),
			},
			quantity: item.quantity,
		}));

		const session = await stripeClient.checkout.sessions.create({
			mode: "payment",
			line_items,
			success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/cart`,
			metadata: {
				userId: req.userId.toString(),
				cartId: cart._id.toString(),
				address: JSON.stringify(address),
			},
		});

		res.status(201).json({
			url: session.url,
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};
