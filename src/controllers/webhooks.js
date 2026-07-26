import dotenv from "dotenv";

import { stripeClient } from "../config/stripe.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";

dotenv.config();

export const stripeWebhook = async (req, res) => {
	const signature = req.headers["stripe-signature"];

	let event;

	try {
		event = stripeClient.webhooks.constructEvent(
			req.body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		return res.status(400).json({
			success: false,
			message: `Webhook Error: ${err.message}`,
		});
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object;
			if (!session.metadata?.userId || !session.metadata?.cartId) {
				throw new Error("Missing metadata");
			}
			const userId = session.metadata.userId;
			const cartId = session.metadata.cartId;

			const address = JSON.parse(session.metadata.address);

			const cart = await Cart.findById(cartId).populate(
				"items.product",
				"name salePrice price stock",
			);
			if (!cart) {
				return res.status(404).json({
					success: false,
					message: "Cart not found",
				});
			}

			try {
				const existingOrder = await Order.findOne({
					stripeSessionId: session.id,
				});

				if (existingOrder) {
					return res.json({ received: true });
				}
				await Order.create({
					user: userId,
					items: cart.items.map((item) => ({
						product: item.product._id,
						name: item.product.name,
						price: item.product.salePrice || item.product.price,
						quantity: item.quantity,
						color: item.color,
						size: item.size,
					})),
					total: session.amount_total / 100,
					paymentStatus: session.payment_status,
					stripeSessionId: session.id,
					stripePaymentIntentId: session.payment_intent,
					shippingAddress: address,
				});

				for (const item of cart.items) {
					item.product.stock -= item.quantity;
					await item.product.save();
				}

				cart.items = [];

				await cart.save();

				return res.json({ received: true });
			} catch (err) {
				console.error("🔥 WEBHOOK CRASHED! Reason:", err.message);
				console.error("Full Error:", err);
				return res
					.status(500)
					.json({ success: false, message: "Internal server error" });
			}
		}

		default:
			console.log(`Unhandled event ${event.type}`);
			return res.json({ received: false });
	}
};
