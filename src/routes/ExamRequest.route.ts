import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import ExamRequestService from "../services/examRequest.service";
import ExamRequestController from "../controller/ExamRequest/ExamRequest.controller";
import { ExamRequestValidation } from "../validation/examRequest.validation.js";

const router = Router();
const examRequestService = new ExamRequestService();
const examRequestController = new ExamRequestController(examRequestService);

router.post("/",Validator.validate(ExamRequestValidation.createExamRequestSchema) , AuthMiddleware.authorize(endPoints.supervisorOrStudentOnly) ,AsyncHandler.asyncHandler(examRequestController.createExamRequest));
router.get("/",AuthMiddleware.authorize(endPoints.supervisorOrStudentOnly) ,AsyncHandler.asyncHandler(examRequestController.getExamRequestsByStudent));
router.get("/supervisor",AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(examRequestController.getExamRequestsBySupervisor));
router.patch("/:id", Validator.validate(ExamRequestValidation.changeStatusExamRequestSchema) ,AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(examRequestController.changeStatusExamRequest));


export default router;
