import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";

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

export default app;
