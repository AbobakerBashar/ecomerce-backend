import { body } from "express-validator";

export const addressValidation = [
	body("phone")
		.trim()
		.notEmpty()
		.withMessage("Phone is required")
		.isMobilePhone()
		.withMessage("Invalid phone number"),

	body("label")
		.trim()
		.notEmpty()
		.withMessage("Label is requered")
		.isIn(["Home", "Work", "Other"])
		.withMessage("Label must be one of: Home, Work, or Other"),

	body("country")
		.trim()
		.notEmpty()
		.withMessage("Country is requered")
		.isLength({ max: 50 })
		.withMessage("Country must not exceed 50 characters"),

	body("state")
		.trim()
		.notEmpty()
		.withMessage("State is requered")
		.isLength({ max: 50 })
		.withMessage("State must not exceed 50 characters"),

	body("city")
		.trim()
		.notEmpty()
		.withMessage("City is requered")
		.isLength({ max: 50 })
		.withMessage("City must not exceed 50 characters"),

	body("street")
		.trim()
		.notEmpty()
		.withMessage("Street is requered")
		.isLength({ max: 50 })
		.withMessage("Street must not exceed 50 characters"),

	body("zip").trim().notEmpty().withMessage("ZIP/postal code is required"),

	body("isDefault")
		.toBoolean()
		.isBoolean()
		.withMessage("isDefault must be a boolean value"),
];
