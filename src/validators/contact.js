import { body } from "express-validator";

export const contactValidation = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Name must be between 3 and 50 characters"),

	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please enter a valid email"),

	body("message")
		.trim()
		.notEmpty()
		.withMessage("Message is required")
		.isLength({ min: 10, max: 1000 })
		.withMessage("Message must be between 10 and 1000 characters"),
	body("type")
		.trim()
		.notEmpty()
		.withMessage("Contact type is requered")
		.isIn(["general", "product", "shipping", "order"])
		.withMessage(
			"Contact type must be one of: General inquiry, Product questions, Order support or Shipping & returns",
		),
];
