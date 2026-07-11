import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Product from "./models/product.js";
import { products } from "./data.js";
import { dbConnection } from "./config/db.js";

import dotenv from "dotenv";
import Category from "./models/category.js";
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

dbConnection().then(() => {
	seed();
});

async function uploadImages(images) {
	const uploaded = [];

	for (const image of images) {
		try {
			const result = await cloudinary.uploader.upload(image, {
				folder: "products",
			});

			uploaded.push(result.secure_url);
		} catch (error) {
			console.log("Failed image:", image);
			console.log(error.message);
		}
	}

	return uploaded;
}

async function seed() {
	try {
		const categories = await Category.find();

		const categoryMap = new Map(
			categories.map((category) => [category.name, category._id]),
		);

		await Product.deleteMany();

		for (const item of products) {
			console.log(`Uploading ${item.name}...`);

			const images = await uploadImages(item.images);

			await Product.create({
				name: item.name,
				brand: item.brand,
				category: categoryMap.get(item.category), // Save ObjectId,
				subCategory: item.subCategory,
				description: item.description,
				price: item.price,
				discount: item.discount,
				slug: item.slug,
				sku: item.sku,
				stock: item.stock,
				isFeatured: item.featured,
				colors: item.colors,
				sizes: item.sizes,
				images,
				gender: item.gender,
			});

			console.log(`${item.name} saved`);
		}

		console.log("Finished seeding.");
		process.exit();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}
