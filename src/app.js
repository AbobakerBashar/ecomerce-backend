import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import userAddressesRoutes from "./routes/addresses.js";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import webhooksRoutes from "./routes/webhooks.js";
import ordersRoutes from "./routes/orders.js";
import contactRoutes from "./routes/contact.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Stripe webhooks
app.use("/api/webhooks", webhooksRoutes);

// middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
		allowedHeaders: ["Content-Type"],
	}),
);
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
	res.send("API is running");
});

// USERS ROUTES
app.use("/api/users", userRoutes);
app.use("/api/user/addresses", userAddressesRoutes);

// PRODUCTS ROUTES
app.use("/api/products", productRoutes);

// CATEGORIES ROUTES
app.use("/api/categories", categoryRoutes);

// CART ROUTES
app.use("/api/cart", cartRoutes);

// CHECKOUT ROUTES
app.use("/api/checkout", checkoutRoutes);

// ORDER ROUTES
app.use("/api/orders", ordersRoutes);

// CONTACT ROUTES
app.use("/api/contact", contactRoutes);

// ERROR HANDLER
app.use(errorHandler);

export default app;
