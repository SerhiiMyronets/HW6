import {Router} from "express";
import {refreshTokenMiddleware} from "../midlewares/refresh-token-middleware";
import {container} from "../composition-root";
import {SessionsController} from "../controllers/sessions-controller";

export const securityDevices = Router({})

const sessionsController = container.resolve(SessionsController)

securityDevices.get('/',
    refreshTokenMiddleware,
    sessionsController.getSessions.bind(sessionsController))

securityDevices.delete('/',
    refreshTokenMiddleware,
    sessionsController.deleteSessions.bind(sessionsController))

securityDevices.delete('/:id',
    refreshTokenMiddleware,
    sessionsController.deleteSession.bind(sessionsController))