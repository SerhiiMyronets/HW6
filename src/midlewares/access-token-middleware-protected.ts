import {NextFunction, Response, Request} from "express";

import {jwtService, usersDBRepository} from "../composition-root";





export const accessTokenMiddlewareProtected = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(401)
    const token = auth.split(' ')[1]
    const userId = await jwtService.getUserIdFromAccessToken(token)
    if (!userId) return res.sendStatus(401)
    const user = await usersDBRepository.findUserById(userId)
    if (!user) return res.sendStatus(401)
    req.user = user
    return next()
}