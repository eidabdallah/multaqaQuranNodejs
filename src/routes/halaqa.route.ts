import { Router } from "express";
import { AsyncHandler } from './../utils/AsyncHandler';
import { Validator } from './../middleware/validation';
import { endPoints } from './../utils/EndPoint';
import { AuthMiddleware } from './../middleware/auth';
import HalaqaController from './../controller/Halaqa/halaqa.controller';
import HalaqaService from './../services/halaqa.service';

const router = Router();
const halaqaService = new HalaqaService();
const halaqaController = new HalaqaController(halaqaService);

router.post("/", AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.createHalaqa));
router.get("/" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getHalaqatByCollege));
router.get("/supervisor" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getSuperVisorsByCollege));
router.get("/students" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getStudentsWithoutHalaqa));
router.get("/allStudent" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.allStudentsByCollege));
router.get("/:halaqaId" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.getHalaqaById));
router.delete("/:halaqaId" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.deleteHalaqa));
router.patch("/:halaqaId/student/:studentId" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.updateStudentHalaqa));
router.patch("/:halaqaId/supervisor/:supervisorId" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.updateSuperVisorHalaqa));
router.patch("/deleteUser/:studentId" , AuthMiddleware.authorize(endPoints.collegeSupervisorOnly) ,AsyncHandler.asyncHandler(halaqaController.deleteUserFromHalaqa));
//Validator.validate()
export default router;
