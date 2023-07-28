import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";


export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const auth = {login: 'admin', password: 'qwerty'}
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = atob(b64auth).toString().split(':')
    if (login !== auth.login || password !== auth.password) {

        return res.sendStatus(401).send('Authentication required.')
    }
    return next()
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
    body("blogId").trim().notEmpty().withMessage('BlogId is required'),
    body("blogId").trim().isString().withMessage('BlogId should be string'),
]