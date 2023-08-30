import {body} from "express-validator";

export const commentsBodyValidation = [
    body('content').exists().isString().isLength({min: 20, max: 300}).withMessage('Comment length should be from 20 to 300 symbols.')
]