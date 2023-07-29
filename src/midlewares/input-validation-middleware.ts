import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {auth} from "../setting";


export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const headerAuth = req.headers.authorization || ''
    if (/Basic .*/.test(headerAuth || '')) {
        const headerLoginPass = atob(headerAuth.split(" ")[1])
        if (/.*:.+/.test(headerLoginPass)) {
            const [login, password] = headerLoginPass.split(':')
            if (login === auth.login || password === auth.password) {
                return next()
            }
        }
    }
    return res.status(401).send('Authentication required.')
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const result = validationResult(req).formatWith(({msg, path}) => ({
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
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('name').trim().isLength({max: 15,}).withMessage('Name length should be below 15 symbols'),
    body("description").trim().notEmpty().withMessage('Description is required'),
    body("description").trim().isLength({max: 500}).withMessage('Description length should be below 500 symbols'),
    body("websiteUrl").trim().notEmpty().withMessage('WebsiteUrl is required'),
    body("websiteUrl").isURL().withMessage('WebsiteUrl should be in URL format'),
    body("websiteUrl").trim().isLength({max: 100}).withMessage('WebsiteUrl should be be below 100 symbols')
]

export const postBodyValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('title').trim().isLength({max: 30,}).withMessage('Title length should be below 30 symbols'),
    body("shortDescription").trim().notEmpty().withMessage('ShortDescription is required'),
    body("shortDescription").trim().isLength({max: 100}).withMessage('ShortDescription length should be below 100 symbols'),
    body("content").trim().notEmpty().withMessage('Content is required'),
    body("content").trim().isLength({max: 1000}).withMessage('Content should be be below 1000 symbols'),
    body("blogId").notEmpty().withMessage('BlogId is required'),
    body("blogId").isString().withMessage('BlogId should be string'),
    body("blogId").isLength({max: 35}).withMessage('BlogId length should be below 35 symbols'),
]