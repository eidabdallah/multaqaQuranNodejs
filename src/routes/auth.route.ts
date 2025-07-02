import { Router } from "express";
import AuthService from './../services/auth.service';
import AuthController from './../controller/Auth/auth.controller';
import { AsyncHandler } from './../utils/AsyncHandler';
import { AuthValidation } from './../validation/auth.validation';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", Validator.validate(AuthValidation.registerSchema) ,AsyncHandler.asyncHandler(authController.register));
router.post("/login", Validator.validate(AuthValidation.loginSchema) ,AsyncHandler.asyncHandler(authController.login));
router.get('/confirmEmail/:token', AsyncHandler.asyncHandler(authController.confirmEmail));
router.get("/user", AuthMiddleware.authorize(endPoints.all), AsyncHandler.asyncHandler(authController.getUser));
router.patch("/changePassword", AuthMiddleware.authorize(endPoints.all), Validator.validate(AuthValidation.changePasswordSchema) ,AsyncHandler.asyncHandler(authController.changePassword));
router.post("/sendCode",Validator.validate(AuthValidation.sendCodeSchema) , AsyncHandler.asyncHandler(authController.sendCode));
router.patch("/forgotPassword",Validator.validate(AuthValidation.forgotPasswordSchema) , AsyncHandler.asyncHandler(authController.forgotPassword));


export default router;
