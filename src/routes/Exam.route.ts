import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import ExamService from './../services/exam.service';
import ExamController from './../controller/Exam/Exam.controller';

const router = Router();
const examService = new ExamService();
const examController = new ExamController(examService);

// router.post("/" , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(examController.));
export default router;
