import {body} from "express-validator";

export const authBodyValidation = [
    body('loginOrEmail').exists().isString().withMessage('Login or Email is required'),
    body('password').exists().isString().isLength({min: 6, max: 20}).withMessage('Password length should be from 6 to 20 symbols.'),
]