import {body} from "express-validator";

export const blogsBodyValidation = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('name').isLength({max: 15,}).withMessage('Name length should be below 15 symbols'),
    body("description").isString().trim().notEmpty().withMessage('Description is required'),
    body("description").isLength({max: 500}).withMessage('Description length should be below 500 symbols'),
    body("websiteUrl").isString().notEmpty().withMessage('WebsiteUrl is required'),
    body("websiteUrl").isURL().withMessage('WebsiteUrl should be in URL format'),
    body("websiteUrl").isLength({max: 100}).withMessage('WebsiteUrl should be be below 100 symbols'),
]