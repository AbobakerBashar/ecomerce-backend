import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";

dotenv.config();

const app = express();

// middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type"],
	}),
);
app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
	res.send("API is running");
});

// user endpoints
app.use("/api/users", userRoutes);

// PRODUCTS ENDPOINTS
app.use("/api/products", productRoutes);

// CATEGORIES ENDPOINTS
app.use("/api/categories", categoryRoutes);

export default app;
