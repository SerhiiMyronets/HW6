import {NextFunction, Response, Request} from "express";
import {jwtService} from "../appliacation/jwt-service";

import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersDbRepository.findUserById(userId)
        return next()
    }
    return res.sendStatus(401)
}