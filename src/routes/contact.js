import { Router } from "express";
import { contact } from "../controllers/contact.js";
import { contactValidation } from "../validators/contact.js";

import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/", contactValidation, validate, contact);

export default router;
