import { Router } from "express";
import AuthService from './../services/auth.service';
import AuthController from './../controller/Auth/auth.controller';
import { AsyncHandler } from './../utils/AsyncHandler';
import { Auth } from "../middleware/auth";
import { AuthValidation } from './../validation/auth.validation';
import { Validator } from './../middleware/validation';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", Validator.validate(AuthValidation.registerSchema) ,AsyncHandler.asyncHandler(authController.register));
router.post("/login", Validator.validate(AuthValidation.loginSchema) ,AsyncHandler.asyncHandler(authController.login));
router.get('/confirmEmail/:token', AsyncHandler.asyncHandler(authController.confirmEmail));
router.get("/user", Auth.authMiddleware(), AsyncHandler.asyncHandler(authController.getUser));



export default router;
