import {NextFunction, Response, Request} from "express";
import {jwtService} from "../appliacation/jwt-service";

import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
        return res.sendStatus(401)
    }
    const token = auth.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersDbRepository.findUserById(userId)
        return next()
    }
    return res.sendStatus(401)
}