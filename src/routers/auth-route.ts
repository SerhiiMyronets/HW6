import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/request-types";
import {AuthModel, MeViewUserModel} from "../models/repository/users-models";
import {usersAuthService} from "../domain/users-auth-service";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {authBodyValidation} from "../midlewares/body/auth-body-validation";
import {jwtService} from "../appliacation/jwt-service";
import {authorizationMiddleware} from "../midlewares/authorization-middleware";


export const authRoute = Router({})

authRoute.post('/login',
    authBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<AuthModel>, res: Response) => {
        const user = await usersAuthService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send(token)
        } else {
            res.sendStatus(401)
        }
    })
authRoute.get('/me',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
        const aboutUser: MeViewUserModel = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        }
        res.status(200).send(aboutUser)
    })