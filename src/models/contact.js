import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
		},
		message: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			trim: true,
			enum: ["general", "product", "shipping", "order"],
		},
	},
	{
		timestamps: true,
	},
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
