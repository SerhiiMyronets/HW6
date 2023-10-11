import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/request-types";
import {
    AuthModel,
    AuthViewModel,
    MeViewUserModel, NewPasswordInputModel,
    PasswordRecoveryInputModel, RegistrationConfirmationCodeModel, ResendConfirmationCodeInputModel,
    UserInputModel
} from "../models/repository/users-models";
import {errorsFormatMiddleware, ErrorType} from "../midlewares/errors-format-middleware";
import {authBodyValidation} from "../midlewares/body/auth-body-validation";
import {accessTokenMiddlewareProtected} from "../midlewares/access-token-middleware-protected";
import {usersRegistrationBodyValidation} from "../midlewares/body/users-registration-body-validation";
import {authService} from "../domain/auth-service";
import {refreshTokenMiddleware} from "../midlewares/refresh-token-middleware";
import {apiRequestMiddleware} from "../midlewares/apiRequestMiddleware";
import {authInputModel} from "../appliacation/jwt-models";
import {authPasswordRecoveryValidation} from "../midlewares/body/auth-password-recovery-validation";
import {authNewPasswordValidation} from "../midlewares/body/auth-new-password-validation";


export const authRoute = Router({})

authRoute.post('/login',
    authBodyValidation,
    apiRequestMiddleware,
    errorsFormatMiddleware,
    async (req: RequestWithBody<AuthModel>, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)
        const authInput: authInputModel = {
            userId: user._id.toString(),
            deviceName: req.headers["user-agent"] ? req.headers["user-agent"].toString() : 'unknown',
            IP: req.socket.remoteAddress || req.headers['x-forwarded-for']!.toString()
        }
        const tokens = await authService.createNewPairOfTokes(authInput)
        if (!tokens) return res.sendStatus(400)
        const accessToken: AuthViewModel = {accessToken: tokens.accessToken}
        return res
            .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send(accessToken)
    })
authRoute.get('/me',
    accessTokenMiddlewareProtected,
    async (req: Request, res: Response) => {
        const aboutUser: MeViewUserModel = {
            email: req.user!.accountData.email,
            login: req.user!.accountData.login,
            userId: req.user!._id.toString()
        }
        res.status(200).send(aboutUser)
    })
authRoute.post('/registration',
    apiRequestMiddleware,
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
    apiRequestMiddleware,
    async (req: RequestWithBody<RegistrationConfirmationCodeModel>, res: Response) => {
        const code = req.body.code
        if (!code) res.sendStatus(400)
        const isConfirmed = await authService.confirmEmail(code)
        if (isConfirmed) {
            res.sendStatus(204)
        } else {
            const errorMessage: ErrorType = {
                errorsMessages: [{
                    message: 'Confirmation code is incorrect or user is already confirmed',
                    field: 'code'
                }]
            }
            res.status(400).send(errorMessage)
        }
    })
authRoute.post('/registration-email-resending',
    apiRequestMiddleware,
    async (req: RequestWithBody<ResendConfirmationCodeInputModel>, res: Response) => {
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
authRoute.post('/password-recovery',
    apiRequestMiddleware,
    authPasswordRecoveryValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<PasswordRecoveryInputModel>, res: Response) => {
        await authService.passwordRecovery(req.body.email)
        res.sendStatus(204)
    })
authRoute.post('/new-password',
    apiRequestMiddleware,
    authNewPasswordValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<NewPasswordInputModel>, res: Response) => {
        const newPassword: NewPasswordInputModel = {
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode
        }
        const isPasswordUpdate = await authService.newPasswordUpdate(newPassword)
        if (!isPasswordUpdate)
            res.sendStatus(400)
        else
            res.sendStatus(204)
    })
authRoute.post('/refresh-token',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const activeSession = req.session
        const tokens = await authService.refreshPairOfTokens(refreshToken, activeSession!)
        if (!tokens) return res.sendStatus(400)
        return res
            .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: tokens.accessToken})
    })
authRoute.post('/logout',
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const activeSession = req.session
        await authService.logOut(activeSession!._id)
        res.sendStatus(204)
    }
)