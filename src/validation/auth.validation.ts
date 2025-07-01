import Joi from "joi";
import { Validator } from './../middleware/validation';
import { CollegesEnum } from './../utils/enum/college.enum';

export class AuthValidation {
    static registerSchema = Joi.object({
        universityId: Validator.generalFields.universityId,
        fullName: Validator.generalFields.fullName,
        password: Validator.generalFields.password,
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            "any.only": "تأكيد كلمة المرور يجب أن يطابق كلمة المرور.",
            "any.required": "حقل تأكيد كلمة المرور مطلوب.",
        }),

        phoneNumber: Joi.string().pattern(/^0\d{9}$/).required().messages({
            "string.empty": "رقم الهاتف مطلوب.",
            "any.required": "رقم الهاتف مطلوب.",
            "string.pattern.base": "رقم الهاتف يجب أن يبدأ بصفر ويتكون من 10 أرقام.",
        }),
        CollegeName: Joi.string().valid(...CollegesEnum).required().messages({
            "any.only": "الكلية غير صالحة.",
            "any.required": "الكلية مطلوبة.",
        }),
        gender: Joi.string().valid('Male', 'Female').required().messages({
            "any.only": "الجنس يجب أن يكون 'ذكر' أو 'أنثى'.",
            "any.required": "الجنس مطلوب.",
        }),
    });

    static loginSchema = Joi.object({
        universityId: Validator.generalFields.universityId,
        password: Validator.generalFields.password,
    });
}


// export const sendCodeSchema = Joi.object({
//     email: Joi.alternatives().try(
//         generalFields.hEmail,
//         generalFields.sEmail
//     ).required().messages({
//         "alternatives.match": "يجب أن يكون البريد الإلكتروني إما بريد طالب من جامعة النجاح أو بريد Gmail.",
//         "any.required": "البريد الإلكتروني مطلوب."
//     }),
// });

// export const forgotPasswordSchema = Joi.object({
//     email: Joi.alternatives().try(
//         generalFields.hEmail,
//         generalFields.sEmail
//     ).required().messages({
//         "alternatives.match": "يجب أن يكون البريد الإلكتروني إما بريد طالب من جامعة النجاح أو بريد Gmail.",
//         "any.required": "البريد الإلكتروني مطلوب."
//     }),
//     password: generalFields.password,
//     code: Joi.string().length(6).required().messages({
//         'string.base': 'يجب أن يكون الرمز عبارة عن نص.',
//         'string.empty': 'لا يمكن أن يكون الرمز فارغاً.',
//         'string.length': 'الرمز خاطئ .',
//         'any.required': 'الرمز مطلوب.'
//     })
// });

// export const changePasswordSchema = Joi.object({
//     email: Joi.alternatives().try(
//         generalFields.hEmail,
//         generalFields.sEmail
//     ).required().messages({
//         "alternatives.match": "يجب أن يكون البريد الإلكتروني إما بريد طالب من جامعة النجاح أو بريد Gmail.",
//         "any.required": "البريد الإلكتروني مطلوب."
//     }),
//     oldPassword: generalFields.password,
//     newPassword: generalFields.password,
// });