import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Category name is required"],
			trim: true,
			unique: true,
			maxlength: [128, "Category name must be less than 128 characters"],
			minlength: [3, "Category name must be at least 3 characters"],
		},
		slug: {
			type: String,
			required: [true, "Category slug is required"],
			trim: true,
			unique: true,
			maxlength: [128, "Category slug must be less than 128 characters"],
			minlength: [3, "Category slug must be at least 3 characters"],
		},
		description: {
			type: String,
			required: [true, "Category description is required"],
			trim: true,
			maxlength: [256, "Category description must be less than 256 characters"],
			minlength: [10, "Category description must be at least 10 characters"],
		},
	},
	{
		timestamps: true,
	},
);

categorySchema.pre("validate", async function () {
	if (!this.slug && this.name) {
		this.slug = slugify(this.name, {
			lower: true,
			strict: true,
		});
	}
});

categorySchema.virtual("products", {
	ref: "Product",
	localField: "_id",
	foreignField: "category",
});

categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
