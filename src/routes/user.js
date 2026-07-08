import { Router } from "express";
import { getSingleUser, login, logout, register } from "../controllers/user.js";
import { loginValidation, registerValidation } from "../validators/user.js";
import { validate } from "../middleware/validate .js";

const router = Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/logout", logout);
router.get("/me", getSingleUser);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.get("/my-profile", getMyProfile);
// router.post("/edit-profile", editProfile);
// router.post("/change-password", changePassword);
// router.get("/all-users", allUsers);
// router.post("/delete-user", deleteUser);
// router.post("/block-user", blockUser);
// router.post("/unblock-user", unblockUser);
// router.get("/single-user", getSingleUser);

export default router;
