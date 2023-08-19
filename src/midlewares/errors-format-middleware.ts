import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export type ErrorMessageType = {
    message: string,
    field: string
}
export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

export const errorsFormatMiddleware = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
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