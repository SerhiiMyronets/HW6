import {NextFunction, Request, Response} from "express";
import {deviceAuthSessionsDbRepository, jwtService, usersDBRepository} from "../composition-root";


export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const payload = await jwtService.getPayloadOfRefreshToken(refreshToken)
    if (!payload) return res.sendStatus(401)
    const user = await usersDBRepository.findUserById(payload.userId)
    if (!user) return res.sendStatus(404)
    const activeSession = await deviceAuthSessionsDbRepository.findSessionByPayload(payload)
    if (!activeSession) return res.sendStatus(401)
    req.session = activeSession
    return next()
}