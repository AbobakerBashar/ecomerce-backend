import { body } from "express-validator";

export const checkoutValidation = [
	body("fullName")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 5, max: 50 })
		.withMessage("Name must be between 5 and 50 characters"),

	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please enter a valid email"),

	body("phone")
		.trim()
		.notEmpty()
		.withMessage("Phnoe number is requered")
		.isMobilePhone()
		.withMessage("Enter valid mobile number"),

	body("address").notEmpty().withMessage("Address is required"),
	body("country").trim().notEmpty().withMessage("Country is requered"),
	body("state").teim().notEmpty().withMessage("State is requered"),
	body("city").trim().notEmpty().withMessage("City is requered"),
	body("zipCode").trim().notEmpty().withMessage("Zip code is requered"),
];
