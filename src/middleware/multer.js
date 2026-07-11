import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const uniqueName =
			Date.now() + "-" + crypto.randomBytes(8).toString("hex") + ext;

		cb(null, uniqueName);
	},
});

export const upload = multer({ storage });
