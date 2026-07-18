import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import cartRoutes from "./routes/cart.js";

dotenv.config();

const app = express();

// middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PATCH", "DELETE"],
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

// PRODUCTS ROUTES
app.use("/api/products", productRoutes);

// CATEGORIES ROUTES
app.use("/api/categories", categoryRoutes);

// CART ROUTES
app.use("/api/cart", cartRoutes);

export default app;
