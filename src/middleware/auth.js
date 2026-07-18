import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
	const token = req.cookies.jwt;
	if (!token) return res.status(401).json({ message: "Unauthorized" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findById(decoded.id).select("_id");

		if (!user) return res.status(401).json({ message: "Unauthorized" });

		req.userId = user._id;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};
