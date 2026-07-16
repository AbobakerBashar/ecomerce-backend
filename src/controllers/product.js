import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";
import Category from "../models/category.js";

const ONE_DAY = 24 * 60 * 60 * 1000;
const LIMIT = 15;

// Create Product
export const createProduct = async (req, res) => {
	try {
		const images = req.files;

		images?.filter((image) => image);
		const body = req.body;

		const imagesUrls = await Promise.all(
			images.map(async (image) => {
				const result = await cloudinary.uploader.upload(image.path, {
					folder: "products",
				});
				return result.secure_url;
			}),
		);

		const product = await Product.create({
			...body,
			images: imagesUrls,
		});

		res.json({ success: true, product });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// Get All Products
export const getAllProducts = async (req, res) => {
	const filter = {};

	const {
		category,
		brand,
		color,
		size,
		page = 1,
		limit = LIMIT,
		sort,
	} = req.query;

	if (brand) filter.brand = brand;

	if (color) {
		const colors = Array.isArray(color) ? color : [color];
		filter.colors = { $in: colors };
	}

	if (size) {
		const sizes = Array.isArray(size) ? size : [size];

		filter.sizes = { $in: sizes };
	}

	let sortOption;
	switch (sort) {
		case "price-low":
			sortOption = { price: 1 };
			break;
		case "price-high":
			sortOption = { price: -1 };
			break;
		case "newest":
			sortOption = { createdAt: -1 };
			break;
		case "featured":
			sortOption = { isFeatured: -1 };
			break;
		default:
			sortOption = { createdAt: -1 };
			break;
	}
	try {
		const categoryId = await Category.findOne({ name: category }).select("_id");
		if (categoryId) filter.category = categoryId._id;

		const products = await Product.find(filter)
			.skip((page - 1) * limit)
			.select(
				"name brand slug description bestSeller images price salePrice discount colors sizes createdAt",
			)
			.populate("category", "name slug")
			.sort(sortOption)
			.limit(20);
		if (!products)
			return res
				.starus(404)
				.json({ success: false, message: "No products found" });

		const totalProducts = await Product.countDocuments(filter);
		const totalPages = Math.ceil(totalProducts / limit);

		const result = products.map((product) => ({
			...product.toObject(),
			newArrival: Date.now() - product.createdAt.getTime() <= ONE_DAY,
		}));

		res.status(200).json({
			success: true,
			products: result,
			pagination: { totalProducts, totalPages, currentPage: Number(page) },
		});
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Get Featured Products
export const getFeaturedProducts = async (req, res) => {
	const limit = req.query?.limit || 8;
	try {
		const products = await Product.find({ isFeatured: true })
			.select(
				"name images description subCategory slug brand price salePrice stock sizes colors",
			)
			.limit(limit);
		if (!products)
			return res
				.status(404)
				.json({ success: false, message: "No products found" });
		res.status(200).json({ success: true, products });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Get new arrivals products
export const getNewArrivalsProducts = async (req, res) => {
	const limit = req.query?.limit || 8;
	try {
		const products = await Product.find()
			.sort({ createdAt: -1 })
			.select("name images description brand slug price salePrice")
			.limit(limit);
		if (!products)
			return res.status(404).json({
				success: false,
				message: "No products found",
			});
		res.status(200).json({ success: true, products });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Get Product By slug
export const getSingleProduct = async (req, res) => {
	const slug = req.params?.slug;
	if (!slug)
		return res.status(400).json({ success: false, message: "Invalid slug" });

	try {
		const product = await Product.findOne({ slug })
			.select(
				"name brand slug description bestSeller images price salePrice discount stock colors sizes createdAt",
			)
			.populate("category", "name slug");
		if (!product)
			res.status(404).json({ success: false, message: "Product not found" });

		res.status(200).json({ success: true, product });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Get Similar Products
export const getSimilarProducts = async (req, res) => {
	const categoryId = req.params?.categoryId;
	const limit = req.query?.limit || 6;

	if (!categoryId)
		return res
			.status(400)
			.json({ success: false, message: "Invalid category id" });

	try {
		const products = await Product.find({ category: categoryId })
			.select(
				"name brand slug description bestSeller images price salePrice discount colors sizes createdAt",
			)
			.populate("category", "name slug")
			.limit(limit);
		if (!products)
			return res
				.status(404)
				.json({ success: false, message: "No products found" });

		res.status(200).json({ success: true, products });
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

// Update Product By Id
export const updateProduct = async (req, res) => {};

// Delete Product By Id
export const deleteProduct = async (req, res) => {};
