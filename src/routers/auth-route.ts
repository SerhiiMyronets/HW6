import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/request-types";
import {AuthModel, MeViewUserModel, UserInputModel} from "../models/repository/users-models";
import {errorsFormatMiddleware, ErrorType} from "../midlewares/errors-format-middleware";
import {authBodyValidation} from "../midlewares/body/auth-body-validation";
import {jwtService} from "../appliacation/jwt-service";
import {authorizationMiddleware} from "../midlewares/authorization-middleware";
import {usersRegistrationBodyValidation} from "../midlewares/body/users-registration-body-validation";
import {authService} from "../domain/auth-service";
import {registrationConfirmationBodyValidation} from "../midlewares/body/registration-confirmation-body-validation";
import {refreshTokenMiddleware} from "../midlewares/refresh-token-middleware";


export const authRoute = Router({})

authRoute.post('/login',
    authBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<AuthModel>, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const tokens = await jwtService.createAccessRefreshTokens(user)
            res
                .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
                .status(200)
                .send({accessToken: tokens.accessToken})
        } else {
            res.sendStatus(401)
        }
    })
authRoute.get('/me',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
        const aboutUser: MeViewUserModel = {
            email: req.user!.accountData.email,
            login: req.user!.accountData.login,
            userId: req.user!._id.toString()
        }
        res.status(200).send(aboutUser)
    })
authRoute.post('/registration',
    usersRegistrationBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {
        const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
        if (user)
            res.sendStatus(204)
        else
            res.sendStatus(400)
    })
authRoute.post('/registration-confirmation',
    registrationConfirmationBodyValidation,
    async (req: RequestWithBody<{ code: string }>, res: Response) => {
        const isConfirmed = await authService.confirmEmail(req.user!._id)
        if (isConfirmed) {
            res.sendStatus(204)
        } else {
            // const errorMessage: ErrorType = {
            //     errorsMessages: [{
            //         message: 'Confirmation code is incorrect or user is already confirmed',
            //         field: 'code'
            //     }]
            // }
            res.sendStatus(400)
        }
    })
authRoute.post('/registration-email-resending',
    async (req: RequestWithBody<{ email: string }>, res: Response) => {
        const isEmailResend = await authService.resendConfirmationEmail(req.body.email)
        if (isEmailResend) {
            res.sendStatus(204)
        } else {
            const errorMessage: ErrorType = {
                errorsMessages: [{
                    message: 'Email is incorrect or user is already confirmed',
                    field: 'email'
                }]
            }
            res.status(400).send(errorMessage)
        }
    })
authRoute.post('/refresh-token',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const tokens = await jwtService.createAccessRefreshTokens(req.user!)
        res
            .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: tokens.accessToken})
    })
authRoute.post('/loguot',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        res.sendStatus(200)
    }
)