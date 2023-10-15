import {Request, Response} from "express";
import {AuthService} from "../domain/auth-service";
import {RequestWithParams} from "../types/request-types";
import {inject, injectable} from "inversify";

@injectable()
export class SessionsController {
    constructor(@inject(AuthService) protected authService: AuthService) {
    }

    async getSessions(req: Request, res: Response) {
        const userId = req.session!.userId
        const activeSessions = await this.authService.getDeviceList(userId)
        res.status(200).send(activeSessions)
    }

    async deleteSessions(req: Request, res: Response) {
        const userId = req.session!.userId
        const sessionId = req.session!._id
        await this.authService.deleteActiveDeviceSessions(userId, sessionId)
        res.sendStatus(204)
    }

    async deleteSession(req: RequestWithParams<{ id: string }>, res: Response) {
        const deviceId = req.params.id
        const userId = req.session!.userId
        const session = await this.authService.getDeviceSession(deviceId)
        if (!session) return res.sendStatus(404)
        if (session.userId !== userId) return res.sendStatus(403)
        await this.authService.deleteSessionById(session._id)
        return res.sendStatus(204)
    }
}