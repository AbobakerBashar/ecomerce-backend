export const parseProductData = (req, res, next) => {
	try {
		if (req.body.sizes) {
			req.body.sizes = JSON.parse(req.body.sizes);
		} else {
			return res.status(400).json({
				message: "Invalid JSON data, sizes is required.",
			});
		}

		if (req.body.colors) {
			req.body.colors = JSON.parse(req.body.colors);
		} else {
			return res.status(400).json({
				message: "Invalid JSON data. colors is required.",
			});
		}

		next();
	} catch (err) {
		return res.status(400).json({
			message: "Invalid JSON data",
		});
	}
};
