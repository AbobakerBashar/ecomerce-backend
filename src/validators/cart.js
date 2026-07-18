import { body } from "express-validator";

const cartValidation = [
	body("productId")
		.notEmpty()
		.withMessage("Product id is required")
		.isMongoId()
		.withMessage("Invalid product id"),
	body("quantity")
		.isInt({ min: 1 })
		.withMessage("Quantity must be a positive integer"),
];

const updateCartValidation = [
	body("quantity")
		.isInt({ min: 1 })
		.withMessage("Quantity must be a positive integer"),
];

export { cartValidation, updateCartValidation };
