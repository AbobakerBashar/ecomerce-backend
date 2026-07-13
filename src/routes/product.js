import { Router } from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getSingleProduct,
	updateProduct,
	getNewArrivalsProducts,
	getSimilarProducts,
} from "../controllers/product.js";
import { productValidation } from "../validators/product.js";
import { validate } from "../middleware/validate .js";
import { upload } from "../middleware/multer.js";
import { parseProductData } from "../middleware/parseProductData.js";
import { validateImages } from "../middleware/validateImages.js";

const router = Router();

router.post(
	"/",
	(req, res, next) => {
		console.log("Request reached route", req.files);
		next();
	},

	upload.array("images", 4),
	parseProductData,
	productValidation,
	validate,
	validateImages,
	createProduct,
);

router.get("/", getAllProducts);

router.get("/featured", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivalsProducts);

router.get("/:slug", getSingleProduct);

router.get("/:categoryId/similar", getSimilarProducts);

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
