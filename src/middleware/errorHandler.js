export const errorHandler = (err, req, res, next) => {
	console.error(err);

	if (res.headersSent) {
		return next(err);
	}

	if (err.name === "ValidationError") {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
		});
	}

	if (err.code === 11000) {
		return res.status(409).json({
			success: false,
			message: "Duplicate value",
		});
	}

	if (err.name === "CastError") {
		return res.status(400).json({
			success: false,
			message: "Invalid resource id",
		});
	}

	const status = err.statusCode || 500;

	res.status(status).json({
		success: false,
		message:
			process.env.NODE_ENV === "production"
				? "Internal server error"
				: err.message,
	});
};
