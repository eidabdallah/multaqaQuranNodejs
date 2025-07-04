import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import HalaqaController from './../controller/Halaqa/halaqa.controller';
import HalaqaService from './../services/halaqa.service';
import { HalaqaValidation } from './../validation/halaqa.validation';

const router = Router();
const halaqaService = new HalaqaService();
const halaqaController = new HalaqaController(halaqaService);

router.post("/", Validator.validate(HalaqaValidation.createHalaqaSchema) , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.createHalaqa));
router.get("/" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getHalaqatByCollege));
router.get("/supervisor" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getSuperVisorsByCollege));
router.get("/students" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getStudentsWithoutHalaqa));
router.get("/allStudent" ,Validator.validate(HalaqaValidation.allStudentsByCollegeSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.allStudentsByCollege));
router.get("/:halaqaId" ,Validator.validate(HalaqaValidation.getHalaqaByIdSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getHalaqaById));
router.delete("/:halaqaId" ,Validator.validate(HalaqaValidation.deleteHalaqaSchema),AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.deleteHalaqa));
router.patch("/:halaqaId/student/:studentId" ,Validator.validate(HalaqaValidation.updateStudentHalaqaSchema), AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.updateStudentHalaqa));
router.patch("/:halaqaId/supervisor/:supervisorId" ,Validator.validate(HalaqaValidation.updateSuperVisorHalaqaSchema) ,AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.updateSuperVisorHalaqa));
router.patch("/deleteUser/:studentId" ,Validator.validate(HalaqaValidation.deleteUserFromHalaqaSchema), AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.deleteUserFromHalaqa));

export default router;
