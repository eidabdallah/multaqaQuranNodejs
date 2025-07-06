import Joi from "joi";
import { Validator } from './../middleware/validation';

export class ExamValidation {
    static assignExamToSupervisorSchema = Joi.object({
       examId: Validator.generalFields.id,
    });
    static insertExamGradeSchema = Joi.object({
        examId: Validator.generalFields.id,
        grade : Joi.number().min(0).max(100).required().messages({
            'any.required': 'الدرجة مطلوبة',
            'number.base': 'الدرجة يجب ان تكون رقم',
            'number.min': 'الدرجة يجب ان تكون بين 0 و 100',
            'number.max': 'الدرجة يجب ان تكون بين 0 و 100',
        })
    });
}
