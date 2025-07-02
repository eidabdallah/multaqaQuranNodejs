import Joi from "joi";
import { Validator } from './../middleware/validation';
import { CollegesEnum } from './../utils/enum/college.enum';

export class UserValidation {
    static updateInfoSchema = Joi.object({
        fullName: Validator.generalFields.fullName,
        phoneNumber: Joi.string().pattern(/^0\d{9}$/).required().messages({
            "string.empty": "رقم الهاتف مطلوب.",
            "any.required": "رقم الهاتف مطلوب.",
            "string.pattern.base": "رقم الهاتف يجب ان يبداء بصفر ويتكون من 10 ارقام.",
        }),
    })
    static getUserSchema = Joi.object({
        userId: Validator.generalFields.id,
    })
}
