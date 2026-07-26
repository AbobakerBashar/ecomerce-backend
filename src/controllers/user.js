import User from "../models/user.js";
import jwt from "jsonwebtoken";

const MAX_AGE = 3 * 24 * 60 * 60 * 1000;

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

	// res.cookie("jwt", token, {
	// 	maxAge: MAX_AGE,
	// 	httpOnly: true,
	// 	secure: process.env.NODE_ENV === "production",
	// 	sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
	// });
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

		res.status(200).json({
			user,
			success: true,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

// Logout user
export const logout = async (req, res) => {
	try {
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
		});

		res.status(200).json({ message: "Logged out successfully", success: true });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
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

//
export const forgotPassword = async (req, res) => {};
export const resetPassword = async (req, res) => {};
export const getMyProfile = async (req, res) => {};
export const editProfile = async (req, res) => {};
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
