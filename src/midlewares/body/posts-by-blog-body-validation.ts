import {body} from "express-validator";



export const postsByBlogBodyValidation = [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('title').isLength({max: 30,}).withMessage('Title length should be below 30 symbols'),
    body("shortDescription").isString().trim().notEmpty().withMessage('ShortDescription is required'),
    body("shortDescription").isLength({max: 100}).withMessage('ShortDescription length should be below 100 symbols'),
    body("content").isString().trim().notEmpty().withMessage('Content is required'),
    body("content").isLength({max: 1000}).withMessage('Content should be be below 1000 symbols'),
]