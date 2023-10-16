import {RequestWithBody} from "../types/request-types";
import {
    AuthModel,
    AuthViewModel,
    MeViewUserModel,
    NewPasswordInputModel,
    PasswordRecoveryInputModel,
    RegistrationConfirmationCodeModel,
    ResendConfirmationCodeInputModel,
    UserInputModel
} from "../models/repository/users-models";
import {Request, Response} from "express";
import {AuthService} from "../domain/auth-service";
import {AuthInputModel} from "../appliacation/jwt-models";
import {ErrorType} from "../midlewares/errors-format-middleware";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService: AuthService) {
    }

    async login(req: RequestWithBody<AuthModel>, res: Response) {
        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)
        const authInput: AuthInputModel = {
            userId: user._id.toString(),
            deviceName: req.headers["user-agent"] ? req.headers["user-agent"].toString() : 'unknown',
            IP: req.socket.remoteAddress || req.headers['x-forwarded-for']!.toString()
        }
        const tokens = await this.authService.createNewPairOfTokes(authInput)
        if (!tokens) return res.sendStatus(400)
        const accessToken: AuthViewModel = {accessToken: tokens.accessToken}
        return res
            .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send(accessToken)
    }

    async aboutMe(req: Request, res: Response) {
        const aboutUser: MeViewUserModel = {
            email: req.user!.accountData.email,
            login: req.user!.accountData.login,
            userId: req.user!._id.toString()
        }
        res.status(200).send(aboutUser)
    }

    async registerNewUser(req: RequestWithBody<UserInputModel>, res: Response) {
        const result = await this.authService.createUser(req.body.login, req.body.email, req.body.password)
        if (result) res.sendStatus(204)
        res.sendStatus(400)
    }

    async confirmRegistration(req: RequestWithBody<RegistrationConfirmationCodeModel>, res: Response) {
        const code = req.body.code
        if (!code) res.sendStatus(400)
        const isConfirmed = await this.authService.confirmEmail(code)
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
    }

    async resendConfirmationEmail(req: RequestWithBody<ResendConfirmationCodeInputModel>, res: Response) {
        const isEmailResend = await this.authService.resendConfirmationEmail(req.body.email)
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
    }

    async sendPasswordRecoveryEmail(req: RequestWithBody<PasswordRecoveryInputModel>, res: Response) {
        await this.authService.passwordRecovery(req.body.email)
        res.sendStatus(204)
    }

    async createNewPassword(req: RequestWithBody<NewPasswordInputModel>, res: Response) {
        const newPassword: NewPasswordInputModel = {
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode
        }
        const isPasswordUpdate = await this.authService.newPasswordUpdate(newPassword)
        if (!isPasswordUpdate)
            res.sendStatus(400)
        else
            res.sendStatus(204)
    }

    async getNewRefreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const activeSession = req.session
        const tokens = await this.authService.refreshPairOfTokens(refreshToken, activeSession!)
        if (!tokens) return res.sendStatus(400)
        return res
            .cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: tokens.accessToken})
    }

    async logout(req: Request, res: Response) {
        const activeSession = req.session
        await this.authService.logOut(activeSession!._id)
        res.sendStatus(204)
    }
}