import {Router, Request, Response} from "express";
import {refreshTokenMiddleware} from "../midlewares/refresh-token-middleware";

export const securityDevices = Router({})

securityDevices.get('/',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {

    })