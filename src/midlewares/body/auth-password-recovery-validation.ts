import {body} from "express-validator";

export const authPasswordRecoveryValidation = [
    body('email').exists().isString().withMessage('Email required'),
    body('email').isEmail().withMessage('Email should be in valid format'),
]