import {param} from "express-validator";

export const ParamValidation = [
    param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid id format')
]