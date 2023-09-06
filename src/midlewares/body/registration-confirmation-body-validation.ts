import {NextFunction, Response} from "express";
import {usersDbRepository} from "../../repositories/db-repositories/users-db-repository";
import {RequestWithBody} from "../../types/request-types";
import {ErrorType} from "../errors-format-middleware";

export const registrationConfirmationBodyValidation = async (req: RequestWithBody<{
    code: string
}>, res: Response, next: NextFunction) => {
    const user = await usersDbRepository.findUserByConfirmationCode(req.body.code)
    if (!user ||
        user.emailConfirmation.isConfirmed ||
        user.emailConfirmation.expirationDate < new Date()) {
        const errorMessage: ErrorType = {
            errorsMessages: [{
                message: 'Confirmation code is incorrect or user is already confirmed',
                field: 'code'
            }]
        }
        return res.status(400).send(errorMessage)
    } else {
        req.user = user
        return next()
    }
}