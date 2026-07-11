import Category from "../models/category.js";

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find()
			.select("name slug")
			.populate({
				path: "products",
				select: "name images price description",
				options: {
					limit: 5,
				},
			});

		if (!categories)
			return res
				.status(404)
				.json({ success: false, message: "No categories found" });

		const result = categories.map((category) => ({
			id: category._id,
			name: category.name,
			slug: category.slug,
			products: category.products.map((product) => ({
				id: product._id,
				name: product.name,
				images: product.images,
				price: product.price,
				description: product.description,
				salePrice: product.salePrice,
			})),
		}));

		res.status(200).json({
			success: true,
			categories: result,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getCategoryById = (req, res) => {};
