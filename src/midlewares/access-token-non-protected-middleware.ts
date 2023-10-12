import {NextFunction, Request, Response} from "express";
import {jwtService, usersDBRepository} from "../composition-root";





export const accessTokenNonProtectedMiddleware = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers.authorization
        const token = auth!.split(' ')[1]
        const userId = await jwtService.getUserIdFromAccessToken(token)
        req.user = await usersDBRepository.findUserById(userId!)
    } catch {
        return next()
    }
    return next()
}