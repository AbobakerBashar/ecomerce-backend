import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
	addAddress,
	getAddresses,
	updateAddress,
} from "../controllers/addresses.js";
import { addressValidation } from "../validators/address.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", auth, getAddresses);
router.post("/", addressValidation, validate, auth, addAddress);
router.put("/:id", addressValidation, validate, auth, updateAddress);

export default router;
