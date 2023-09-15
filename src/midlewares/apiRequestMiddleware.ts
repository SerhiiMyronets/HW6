import {NextFunction, Request, Response} from "express";
import {apiRequestDbRepository} from "../repositories/db-repositories/api-request-db-repository";
import {apiRequestDatabase} from "../db/db-models";

export const apiRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (!IP) return res.sendStatus(403)
    const request: apiRequestDatabase = {
        IP,
        URL: req.baseUrl || req.originalUrl,
        date: new Date()
    }
    const previousRequests = await apiRequestDbRepository.getRequestByIP(request)

    const requestId = await apiRequestDbRepository.addRequest(request)

return next()
}