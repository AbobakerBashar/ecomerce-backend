import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Please enter your name"],
			minlength: [3, "Minimum name length is 3 characters"],
			maxlength: [50, "Maximum name length is 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			trim: true,
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Please enter a valid email"],
		},
		password: {
			type: String,
			select: false,
			required: [true, "Please enter your password"],
			minlength: [6, "Minimum password length is 6 characters"],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Create static metho for logging in
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email }).select("+password");
	if (!user) throw Error("Incorrect email");
	const match = await bcrypt.compare(password, user.password);
	if (!match) throw Error("Incorrect password");
	return user;
};

// Admin login
userSchema.statics.adminLogin = async function (email, password) {
	const user = await this.findOne({ email }).select("+password");
	if (!user) throw Error("Incorrect email");

	const match = await bcrypt.compare(password, user.password);
	if (!match) throw Error("Incorrect password");

	if (!user.isAdmin) throw Error("You are not an admin");

	return user;
};

const User = mongoose.model("User", userSchema);

export default User;
