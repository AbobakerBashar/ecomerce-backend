import dotenv from "dotenv";
import app from "./app.js";
import { dbConnection } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

let server;

process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);

	if (server) {
		server.close(() => process.exit(1));
	} else {
		process.exit(1);
	}
});

process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err);

	if (server) {
		server.close(() => process.exit(1));
	} else {
		process.exit(1);
	}
});

dbConnection()
	.then(() => {
		connectCloudinary();

		server = app.listen(PORT, () => {
			console.log(`Database connected & Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
