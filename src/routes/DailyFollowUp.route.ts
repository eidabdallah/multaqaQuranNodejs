import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import StudentDailyFollowUpController from './../controller/StudentDailyFollowUp/StudentDailyFollowUp.controller';
import StudentDailyFollowUpService from './../services/StudentDailyFollowUp.service';
import { DailyFollowUpValidation } from './../validation/dailayFollow.validation';

const router = Router();
const dailyFollowService = new StudentDailyFollowUpService();
const dailyFollowController = new StudentDailyFollowUpController(dailyFollowService);

router.post("/" ,Validator.validate(DailyFollowUpValidation.createDailyFollowUpSchema) ,AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.createDailyFollowUp));
router.patch("/:id" , Validator.validate(DailyFollowUpValidation.updateDailyFollowUpSchema) ,AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.updateDailyFollowUp));
router.delete("/:id" ,Validator.validate(DailyFollowUpValidation.idDailyFollowUpSchema) , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.deleteDailyFollowUp));
router.get("/" , AuthMiddleware.authorize(endPoints.supervisorOrStudentOnly) ,AsyncHandler.asyncHandler(dailyFollowController.getAllDailyFollowUpForStudent));
// Supervisor views daily follow-up for a specific student by ID.
router.get("/statistics" ,Validator.validate(DailyFollowUpValidation.statisticsSchema) , AuthMiddleware.authorize(endPoints.adminOrDoctorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.getStatistics));
router.get("/:id" ,Validator.validate(DailyFollowUpValidation.idDailyFollowUpSchema) , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(dailyFollowController.getAllDailyFollowUpForSuperVisor));

export default router;
