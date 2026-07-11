import dotenv from "dotenv";
import app from "./app.js";
import { dbConnection } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

dbConnection()
	.then(() => {
		connectCloudinary();
		app.listen(PORT, () => {
			console.log(`Database connected & Server running on port ${PORT}`);
		});
	})
	.catch(console.error);
