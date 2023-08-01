import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {auth} from "../setting";
import {blogsRepository} from "../repositories/blogs-repository";


export const authentication = (req: Request, res: Response, next: NextFunction) => {

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    try {
        const [login, password] = atob(b64auth).split(':')
        if (login !== auth.login || password !== auth.password || (req.headers.authorization || '').split(' ')[0] !== 'Basic') {
            return res.status(401).send('Authentication required.')
        }
        return next()
    } catch (e) {
        return res.status(401).send('Authentication required.')
    }
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req).formatWith(({msg, path}: any) => ({
        message: msg,
        field: path
    }));

    if (!result.isEmpty()) {
        res.status(400).send({errorsMessages: result.array({onlyFirstError: true})});
    } else {
        next()
    }
}

export const blogBodyValidation = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('name').isLength({max: 15,}).withMessage('Name length should be below 15 symbols'),
    body("description").isString().trim().notEmpty().withMessage('Description is required'),
    body("description").isLength({max: 500}).withMessage('Description length should be below 500 symbols'),
    body("websiteUrl").isString().notEmpty().withMessage('WebsiteUrl is required'),
    body("websiteUrl").isURL().withMessage('WebsiteUrl should be in URL format'),
    body("websiteUrl").isLength({max: 100}).withMessage('WebsiteUrl should be be below 100 symbols')
]

export const postBodyValidation = [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('title').isLength({max: 30,}).withMessage('Title length should be below 30 symbols'),
    body("shortDescription").isString().trim().notEmpty().withMessage('ShortDescription is required'),
    body("shortDescription").isLength({max: 100}).withMessage('ShortDescription length should be below 100 symbols'),
    body("content").isString().trim().notEmpty().withMessage('Content is required'),
    body("content").isLength({max: 1000}).withMessage('Content should be be below 1000 symbols'),
    body("blogId").isString().notEmpty().withMessage('BlogId is required'),
    body("blogId").isString().custom(blogId => {
        const isBlogExist = blogsRepository.getBlogById(blogId);
        if (!isBlogExist) {
            throw new Error("Blog not found")
        }
        return true
    })

]