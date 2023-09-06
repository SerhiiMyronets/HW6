import {NextFunction, Request, Response} from "express";
import {tokenBlackListDbRepository} from "../repositories/db-repositories/token-black-list-db-repository";
import {jwtService} from "../appliacation/jwt-service";
import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken)
        return res.sendStatus(401)
    const isTokenInBlackList = await tokenBlackListDbRepository.isTokenInBlackList(refreshToken)
    if (isTokenInBlackList)
        return res.sendStatus(401)
    const userId = await jwtService.getUserIdByToken(refreshToken)
    if (!userId)
        return res.sendStatus(401)
    const user = await usersDbRepository.findUserById(userId)
    if (!user)
        return res.sendStatus(401)
    req.user = user
    await tokenBlackListDbRepository.addToken(userId, refreshToken)
    return next()
}