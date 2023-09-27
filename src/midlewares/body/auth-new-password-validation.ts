import {body} from "express-validator";

export const authNewPasswordValidation = [
    body('newPassword').exists().isString().isLength({min: 6, max: 20}).withMessage('Password length should be from 6 to 20 symbols.') ,
    body('recoveryCode').exists().isUUID().withMessage('Confirmation code is not valid'),
]