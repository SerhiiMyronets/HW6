import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const ErrorsFormatMiddleware = (req: Request, res: Response, next: NextFunction) => {
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



