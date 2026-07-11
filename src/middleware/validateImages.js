export const validateImages = (req, res, next) => {
	if (!req.files || req.files.length === 0) {
		return res.status(400).json({
			success: false,
			errors: {
				images: "Upload at least one image",
			},
		});
	}

	next();
};
