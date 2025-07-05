import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import StudentDailyFollowUpController from './../controller/StudentDailyFollowUp/StudentDailyFollowUp.controller';
import StudentDailyFollowUpService from './../services/StudentDailyFollowUp.service';

const router = Router();
const dailyFollowService = new StudentDailyFollowUpService();
const dailyFollowController = new StudentDailyFollowUpController(dailyFollowService);

router.post("/" , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.createDailyFollowUp));
router.patch("/:id" , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.updateDailyFollowUp));
router.delete("/:id" , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.deleteDailyFollowUp));
router.get("/" , AuthMiddleware.authorize(endPoints.studentOnly) ,AsyncHandler.asyncHandler(dailyFollowController.getAllDailyFollowUpForStudent));
// Supervisor views daily follow-up for a specific student by ID.
router.get("/:id" , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.getAllDailyFollowUpForSuperVisor));

/*,Validator.validate(AdminValidation.createUserSchema) */
export default router;
