import {Request, Response, Router} from "express";
import {refreshTokenMiddleware} from "../midlewares/refresh-token-middleware";
import {authService} from "../domain/auth-service";
import {RequestWithParams} from "../types/request-types";

export const securityDevices = Router({})

securityDevices.get('/',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const userId = req.session!.userId
        const activeSessions = await authService.getDeviceList(userId)
        res.status(200).send(activeSessions)
    })
securityDevices.delete('/',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const userId = req.session!.userId
        const sessionId = req.session!._id
        await authService.deleteActiveDeviceSessions(userId, sessionId)
        res.sendStatus(204)
    })
securityDevices.delete('/:id',
    refreshTokenMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const deviceId = req.params.id
        const userId = req.session!.userId
        const session = await authService.getDeviceSession(deviceId)
        if (!session) return res.sendStatus(404)
        if (session.userId !== userId) return res.sendStatus(403)
        await authService.deleteSessionById(session._id)
        return res.sendStatus(204)
    })