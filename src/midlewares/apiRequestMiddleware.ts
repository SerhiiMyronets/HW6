import {NextFunction, Request, Response} from "express";
import {apiRequestDbRepository} from "../repositories/db-repositories/api-request-db-repository";
import {ApiRequestDatabaseDBType} from "../db/db-models";
import {settings} from "../setting";
import add from "date-fns/add";

export const apiRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if (!IP) return res.sendStatus(400)
    const newRequest = new ApiRequestDatabaseDBType(IP.toString(),req.originalUrl)
    const requestValidDate = add(newRequest.date, settings.REQUEST_TIME_LIMIT)
    const previousRequests = await apiRequestDbRepository.getRequestByIP(newRequest, requestValidDate)
    if (previousRequests.length >= settings.REQUEST_COUNT_LIMIT)
        return res.sendStatus(429)
    await apiRequestDbRepository.addRequest(newRequest)
    return next()
}