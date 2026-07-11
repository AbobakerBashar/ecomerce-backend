import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter product name"],
			trim: true,
			maxlength: [100, "Name cannot exceed 100 characters"],
		},
		brand: {
			type: String,
			required: [true, "Please enter product brand"],
			trim: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: [true, "Please enter product category"],
		},
		subCategory: {
			type: String,
			required: [true, "Please enter product sub-category"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Please enter product description"],
			trim: true,
			maxlength: [2000, "Description cannot exceed 2000 characters"],
		},
		price: {
			type: Number,
			required: [true, "Please enter product price"],
			min: [0, "Price cannot be negative"],
		},
		discount: {
			type: Number,
			default: 0,
			min: [0, "Discount cannot be less than 0"],
			max: [100, "Discount cannot be more than 100"],
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		sku: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
		},
		stock: {
			type: Number,
			required: [true, "Please enter stock quantity"],
			default: 0,
			min: [0, "Stock cannot be negative"],
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		colors: [
			{
				name: { type: String, required: true },
				value: { type: String, required: true },
			},
		],
		sizes: {
			type: [],
		},
		images: {
			type: [String],
			required: [true, "Please provide at least one image"],
		},
		gender: {
			type: String,
			enum: ["Men", "Women", "Unisex", "Kids"],
			default: "Unisex",
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);
productSchema.virtual("salePrice").get(function () {
	if (this.discount > 0) {
		return this.price - this.price * (this.discount / 100);
	}
	return this.price;
});

productSchema.pre("validate", async function () {
	if (!this.slug && this.name) {
		this.slug = slugify(this.name, {
			lower: true,
			strict: true,
		});
	}
});

const Product = mongoose.model("Product", productSchema);
export default Product;
