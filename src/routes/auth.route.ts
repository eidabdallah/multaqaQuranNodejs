import { Router } from "express";
import AuthService from './../services/auth.service';
import AuthController from './../controller/Auth/auth.controller';
import { AsyncHandler } from './../utils/AsyncHandler';
import { Auth } from "../middleware/auth";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", AsyncHandler.asyncHandler(authController.register));
router.get('/confirmEmail/:token', AsyncHandler.asyncHandler(authController.confirmEmail));
router.post("/login", AsyncHandler.asyncHandler(authController.login));
router.get("/user", Auth.authMiddleware, AsyncHandler.asyncHandler(authController.getUser));



export default router;
