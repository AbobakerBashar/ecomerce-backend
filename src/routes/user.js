import { Router } from "express";
import {
	editProfile,
	getSingleUser,
	login,
	register,
	resetPassword,
} from "../controllers/user.js";
import {
	loginValidation,
	registerValidation,
	resetValidation,
	updateValidation,
} from "../validators/user.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", getSingleUser);
router.patch("/me", auth, updateValidation, validate, editProfile);
router.patch("/reset-password", auth, resetValidation, validate, resetPassword);

// router.post("/forgot-password", forgotPassword);
// router.get("/my-profile", getMyProfile);
// router.post("/edit-profile", editProfile);
// router.post("/change-password", changePassword);
// router.get("/all-users", allUsers);
// router.post("/delete-user", deleteUser);
// router.post("/block-user", blockUser);
// router.post("/unblock-user", unblockUser);
// router.get("/single-user", getSingleUser);

/*===================================================================
Admin Routes
=============================================*/
router.post("/admin/login", loginValidation, validate, login);
router.get("/admin/me", getSingleUser);

export default router;
