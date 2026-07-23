import mongoose from "mongoose";
import validator from "validator";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},

				name: String,
				price: Number,
				quantity: Number,

				color: String,
				size: String,
			},
		],

		total: {
			type: Number,
			required: true,
		},

		shippingAddress: {
			fullName: String,
			email: String,
			phone: String,
			address: String,
			city: String,
			state: String,
			country: String,
			zip: String,
		},

		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed", "refunded"],
			default: "pending",
		},

		orderStatus: {
			type: String,
			enum: ["processing", "shipped", "delivered", "cancelled"],
			default: "processing",
		},

		stripeSessionId: String,
		stripePaymentIntentId: String,
	},
	{ timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
