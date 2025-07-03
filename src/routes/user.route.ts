import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import UserService from './../services/user.service';
import UserController from './../controller/User/user.controller';
import { UserValidation } from './../validation/user.validation';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.patch("/", Validator.validate(UserValidation.updateInfoSchema) ,AuthMiddleware.authorize(endPoints.all) ,AsyncHandler.asyncHandler(userController.updateInfo));
router.get("/:userId", Validator.validate(UserValidation.getUserSchema) , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(userController.getUserById));
router.patch("/changeRole" , Validator.validate(UserValidation.changeRoleSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(userController.changeRole));
export default router;
