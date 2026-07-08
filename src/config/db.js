import mongoose from "mongoose";

export const dbConnection = async () =>
	await mongoose.connect(process.env.MONGODB_URI);
