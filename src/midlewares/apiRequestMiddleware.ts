import {NextFunction, Request, Response} from "express";
import {apiRequestDbRepository} from "../repositories/db-repositories/api-request-db-repository";
import {ApiRequestDatabaseModel} from "../db/db-models";
import {settings} from "../setting";
import add from "date-fns/add";

export const apiRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (!IP) return res.sendStatus(400)
    const request: ApiRequestDatabaseModel = {
        IP: IP.toString(),
        URL: req.originalUrl,
        date: new Date()
    }
    const requestValidDate = add(request.date, settings.REQUEST_TIME_LIMIT)
    const previousRequests = await apiRequestDbRepository.getRequestByIP(request, requestValidDate)
    if (previousRequests.length > settings.REQUEST_COUNT_LIMIT)
        return res.sendStatus(423)
    await apiRequestDbRepository.addRequest(request)
    return next()
}