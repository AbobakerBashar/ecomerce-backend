import { body } from "express-validator";

export const productValidation = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Name must be between 3 and 50 characters"),
	body("brand")
		.trim()
		.notEmpty()
		.withMessage("Brand is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Brand must be between 3 and 50 characters"),

	body("category")
		.trim()
		.notEmpty()
		.withMessage("Category is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Category must be between 3 and 50 characters"),
	body("category")
		.isIn(["shoes", "apparel", "electronics", "accessories"])
		.withMessage("Invalid category"),

	body("subCategory")
		.trim()
		.notEmpty()
		.withMessage("Sub Category is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Sub Category must be between 3 and 50 characters"),

	body("description").trim().notEmpty().withMessage("Description is required"),

	body("price")
		.isFloat({ min: 0.01 })
		.withMessage("Price must be greater than or equal to 0.01"),

	body("discount")
		.optional()
		.isFloat({ min: 0, max: 100 })
		.withMessage("Discount must be between 0 and 100"),

	body("stock")
		.isInt({ min: 0 })
		.withMessage("Stock must be a positive integer"),

	body("sku")
		.trim()
		.notEmpty()
		.withMessage("SKU is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("SKU must be between 3 and 50 characters"),

	body("sizes").isArray({ min: 1 }).withMessage("Select at least one size"),
	body("sizes.*").trim().notEmpty().withMessage("Invalid size"),

	body("colors.*.name").trim().notEmpty().withMessage("Color name is required"),

	body("colors.*.value")
		.matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
		.withMessage("Invalid color value"),

	body("gender")
		.trim()
		.notEmpty()
		.withMessage("Gender is required")
		.isIn(["Men", "Women", "Unisex", "Kids"])
		.withMessage("Invalid gender"),
];
