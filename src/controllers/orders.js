import Order from "../models/order.js";

export const getAllOrders = async (req, res) => {
	const { q, status } = req.query;

	const filter = {};
	if (q) filter._id = q;
	if (status) filter.orderStatus = status;

	try {
		const orders = await Order.find({ user: req.userId, ...filter })
			.select("shippingAddress items total paymentStatus orderStatus")
			.populate("items.product", "images name");
		if (!orders)
			return res.status(404).json({
				message: "No order found.",
				success: false,
			});

		const result = orders.map((order) => {
			const items = order.items.map((item) => ({
				name: item.product.name,
				id: item._id,
				price: item.price,
				quantity: item.quantity,
				color: item.color,
				size: item.size,
				images: item.product?.images,
			}));
			return {
				items: items,
				id: order.id,
				total: order.total,
				paymentStatus: order.paymentStatus,
				orderStatus: order.orderStatus,
				shippingAddress: order.shippingAddress,
				createdAt: order.createdAt,
			};
		});

		res.status(200).json({
			success: true,
			orders: result,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

export const getOrder = async (req, res) => {
	const session_id = req.params?.session_id;

	if (!session_id)
		return res.status(400).json({
			message: "session_id not found",
			success: false,
		});

	try {
		const order = await Order.findOne({
			user: req.userId,
			stripeSessionId: session_id,
		})
			.select("shippingAddress items total paymentStatus orderStatus")
			.populate("items.product", "images name");
		if (!order)
			return res.status(404 || order.items?.length === 0).json({
				message: "Order not found",
				success: false,
			});

		const orderItems = order.items.map((item) => ({
			name: item.product.name,
			id: item._id,
			price: item.price,
			quantity: item.quantity,
			color: item.color,
			size: item.size,
			images: item.product?.images,
		}));

		res.status(200).json({
			success: true,
			order: {
				items: orderItems,
				id: order.id,
				total: order.total,
				paymentStatus: order.paymentStatus,
				orderStatus: order.orderStatus,
				shippingAddress: order.shippingAddress,
				createdAt: order.createdAt,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getTotalOrders = async (req, res) => {
	try {
		const count = await Order.countDocuments({ user: req.userId });

		res.status(200).json({
			success: true,
			count,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
