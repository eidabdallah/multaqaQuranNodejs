import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import ExamService from './../services/exam.service';
import ExamController from './../controller/Exam/Exam.controller';
import { ExamValidation } from './../validation/exam.validation';

const router = Router();
const examService = new ExamService();
const examController = new ExamController(examService);

router.get("/examRequest" , AuthMiddleware.authorize(endPoints.tasmeaifzSupervisorOnly) ,AsyncHandler.asyncHandler(examController.getAllExamsRequest));
router.get("/" , AuthMiddleware.authorize(endPoints.tasmeaifzSupervisorOnly) ,AsyncHandler.asyncHandler(examController.getPendingExamsBySupervisor));
router.get("/stuedntExam" , AuthMiddleware.authorize(endPoints.supervisorOrStudentOnly) ,AsyncHandler.asyncHandler(examController.getStudentExam));
router.get("/stuedntSupervisor" , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(examController.getStudentForSupervisor));
router.get("/formalExam" , AuthMiddleware.authorize(endPoints.doctorOnly) ,AsyncHandler.asyncHandler(examController.getFormalExams));
router.patch("/" ,Validator.validate(ExamValidation.insertExamGradeSchema) , AuthMiddleware.authorize(endPoints.tasmeaifzSupervisorOnly) ,AsyncHandler.asyncHandler(examController.insertExamGrade));
router.patch("/:examId" ,Validator.validate(ExamValidation.assignExamToSupervisorSchema) , AuthMiddleware.authorize(endPoints.doctorOrTasmeaifzSupervisorOnly) ,AsyncHandler.asyncHandler(examController.assignExamToSupervisor));
router.post("/" ,Validator.validate(ExamValidation.createFormalExamSchema) , AuthMiddleware.authorize(endPoints.supervisorOnly) ,AsyncHandler.asyncHandler(examController.createFormalExam));

export default router;
