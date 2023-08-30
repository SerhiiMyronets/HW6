import {param} from "express-validator";

export const paramValidation = [
    param('id').isMongoId().withMessage('Invalid id format') // .matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid id format')
]