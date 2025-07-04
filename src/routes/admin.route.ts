import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import AdminService from './../services/admin.service';
import AdminController from './../controller/Admin/admin.controller';
import { AdminValidation } from './../validation/admin.validation';

const router = Router();
const adminService = new AdminService();
const adminController = new AdminController(adminService);

router.get("/", AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.getAllRequests));
router.patch("/accept/:userId",Validator.validate(AdminValidation.acceptRequestSchema) ,AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.acceptRequest));
router.post("/",Validator.validate(AdminValidation.createUserSchema) , AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.createUser));
router.patch("/confirmEmail/:userId",Validator.validate(AdminValidation.acceptRequestSchema) ,AuthMiddleware.authorize(endPoints.adminOnly) ,AsyncHandler.asyncHandler(adminController.changeConfirmEmail));


export default router;
