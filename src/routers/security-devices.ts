import {Router} from "express";
import {refreshTokenMiddleware} from "../midlewares/refresh-token-middleware";
import {sessionsController} from "../composition-root";

export const securityDevices = Router({})


securityDevices.get('/',
    refreshTokenMiddleware,
    sessionsController.getSessions.bind(sessionsController))

securityDevices.delete('/',
    refreshTokenMiddleware,
    sessionsController.deleteSessions.bind(sessionsController))

securityDevices.delete('/:id',
    refreshTokenMiddleware,
    sessionsController.deleteSession.bind(sessionsController))