import {NextFunction, Response, Request} from "express";
import {jwtService} from "../appliacation/jwt-service";

import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(401)
    const token = auth.split(' ')[1]
    const userId = await jwtService.getUserIdFromAccessToken(token)
    if (!userId) return res.sendStatus(401)
    const user = await usersDbRepository.findUserById(userId)
    if (!user) return res.sendStatus(401)
    req.user = user
    return next()
}