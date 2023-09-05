import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/request-types";
import {AuthModel, MeViewUserModel, UserInputModel} from "../models/repository/users-models";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {authBodyValidation} from "../midlewares/body/auth-body-validation";
import {jwtService} from "../appliacation/jwt-service";
import {authorizationMiddleware} from "../midlewares/authorization-middleware";
import {usersRegistrationBodyValidation} from "../midlewares/body/users-registration-body-validation";
import {authService} from "../domain/auth-service";


export const authRoute = Router({})

authRoute.post('/login',
    authBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<AuthModel>, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
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
authRoute.post('/registration',
    usersRegistrationBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {

    })