import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// handle error
const handleError = (err) => {
	const errors = {};

	if (err.code === 11000) errors.email = "Email is already registered";

	if (err.name === "ValidationError") {
		Object.keys(err.errors).forEach((key) => {
			errors[key] = err.errors[key].message;
		});
	}

	if (err.message === "Incorrect email") {
		errors.email = "Incorrect email, Please enter valid crendentail";
	}

	if (err.message === "Incorrect password") {
		errors.password = "Incorrect password, Please enter valid crendentail";
	}

	return errors;
};

// Handle Create Token
const handleCreateToken = (res, id) => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "3d",
	});

	return token;
};

// Create an account
export const register = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const user = await User.create({ name, email, password });
		if (!user)
			return res.status(500).json({
				success: false,
				errors: {
					internalErr: "Something went wrong. Please try again later.",
				},
			});

		//
		const token = handleCreateToken(res, user._id);

		res.status(201).json({
			success: true,
			token,
			user: {
				name: user.name,
				email: user.email,
				id: user._id,
				isAdmin: user.isAdmin,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	} catch (err) {
		const errors = handleError(err);

		if (Object.keys(errors).length) {
			return res.status(400).json({
				success: false,
				errors,
			});
		}

		res.status(500).json({
			success: false,
			errors: { internalErr: err.message },
		});
	}
};

//Get single user
export const getSingleUser = async (req, res) => {
	try {
		const token = req.cookies?.jwt;
		if (!token) return res.status(401).json({ message: "Unauthorized" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) return res.status(401).json({ message: "Unauthorized" });
		const user = await User.findById(decoded.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		const addresses = user.addresses.map((a) => ({
			label: a.label,
			phone: a.phone,
			street: a.street,
			city: a.city,
			state: a.state,
			zip: a.zip,
			country: a.country,
			isDefault: a.isDefault,
			id: a._id,
		}));

		res.status(200).json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				isAdmin: user.isAdmin,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				addresses,
			},
			success: true,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

// Login user
export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.login(email, String(password));

		if (!user) return res.status(404).json({ message: "User not found" });

		const token = handleCreateToken(res, user._id);

		res.status(201).json({
			token,
			user: {
				name: user.name,
				email: user.email,
				id: user._id,
				isAdmin: user.isAdmin,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			success: true,
		});
	} catch (error) {
		const errors = handleError(error);
		if (Object.keys(errors).length) {
			return res.status(400).json({
				success: false,
				errors,
			});
		}

		res.status(500).json({
			success: false,
			errors: { internalErr: error.message },
		});
	}
};

//UPDTAE PROFILE
export const editProfile = async (req, res) => {
	const { email, name, phone } = req.body;
	console.log({ email, name, phone });
	try {
		const user = await User.findById(req.userId);
		if (!user)
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});

		if (email) user.email = email;
		if (name) user.name = name;
		if (phone) user.phone = phone;

		await user.save();

		res.status(200).json({
			user,
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
	const { newPassword, currentPassword } = req.body;

	try {
		const user = await User.findById(req.userId).select("+password");
		if (!user)
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});

		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch)
			return res.status(404).json({
				success: false,
				message: "Incorrect password.",
			});
		user.password = newPassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password changed successfully!",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const forgotPassword = async (req, res) => {};
export const getMyProfile = async (req, res) => {};
export const changePassword = async (req, res) => {};
export const allUsers = async (req, res) => {};
export const deleteUser = async (req, res) => {};
export const blockUser = async (req, res) => {};
export const unblockUser = async (req, res) => {};

/*===================================================================
Admin Controllers
=============================================*/
export const adminLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.adminLogin(email, String(password));
		if (!user) return res.status(404).json({ message: "User not found" });

		setTokenCookies(res, user._id);

		res.status(201).json({
			user: {
				name: user.name,
				email: user.email,
				id: user._id,
				isAdmin: user.isAdmin,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			success: true,
		});
	} catch (error) {
		const errors = handleError(error);
		if (Object.keys(errors).length)
			return res.status(400).json({
				success: false,
				errors,
			});

		res.status(500).json({
			success: false,
			errors: { internalErr: error.message },
		});
	}
};
