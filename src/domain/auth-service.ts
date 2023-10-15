import {DeviceAuthSessionDBType, PasswordRecoveryDBType, UsersBDType} from "../db/db-models";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {EmailManager} from "../managers/email-manager";
import {settings} from "../setting";
import {ObjectId, WithId} from "mongodb";
import {AccessRefreshTokensModel, AuthInputModel} from "../appliacation/jwt-models";
import {DeviceAuthSessionsDbRepository} from "../repositories/db-repositories/device-auth-sessions-db-repository";
import {JwtService} from "../appliacation/jwt-service";
import {ConfirmationCodeUpdateModel, DeviceViewModel, NewPasswordInputModel} from "../models/repository/users-models";
import {PasswordRecoveryDbRepository} from "../repositories/db-repositories/password-recovery-db-repository";
import {UsersDBRepository} from "../repositories/db-repositories/users-db-repository";
import {inject, injectable} from "inversify";

const bcrypt = require('bcrypt');

@injectable()
export class AuthService {
    constructor(@inject(UsersDBRepository) protected usersDBRepository: UsersDBRepository,
                @inject(EmailManager) protected emailManager: EmailManager,
                @inject(DeviceAuthSessionsDbRepository) protected deviceAuthSessionsDbRepository: DeviceAuthSessionsDbRepository,
                @inject(JwtService) protected jwtService: JwtService,
                @inject(PasswordRecoveryDbRepository) protected passwordRecoveryDbRepository: PasswordRecoveryDbRepository) {
    }

    async createUser(login: string, email: string, pass: string): Promise<WithId<UsersBDType> | null> {
        const password = await bcrypt.hash(pass, 10)
        const expirationDate = add(new Date(), settings.EMAIL_CONFIRMATION_CODE_EXP)
        const newUser = new UsersBDType(login, email, password, expirationDate)
        const createdUserId = await this.usersDBRepository.createUser(newUser)
        const createdUser = await this.usersDBRepository.findUserById(createdUserId)
        if (createdUser)
            try {
                await this.emailManager.sendEmailConfirmationCode(createdUser)
            } catch (error) {
                console.error(error)
                await this.usersDBRepository.deleteUser(createdUser._id.toString())
                return null
            }
        return createdUser
    }

    async confirmEmail(code: string): Promise<boolean> {
        const user = await this.usersDBRepository.findUserByEmailConfirmationCode(code)
        if (!user) return false
        if (user.canBeConfirmed())
            return await this.usersDBRepository.updateConfirmation(user._id);
        return false

    }

    async checkCredentials(login: string, pass: string) {
        const user = await this.usersDBRepository.findUserByLoginOrEmail(login)
        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null
        if (await bcrypt.compare(pass, user.accountData.password))
            return user
        else
            return null
    }


    async passwordRecovery(email: string): Promise<boolean> {
        const user = await this.usersDBRepository.findUserByEmail(email)
        if (!user) return true
        await this.passwordRecoveryDbRepository.deletePreviousPasswordRecoveryRequest(user._id)
        const expirationDate = add(new Date(), settings.PASSWORD_RECOVERY_CONFIRMATION_CODE_EXP)
        const newPasswordRecovery = new PasswordRecoveryDBType(
            user._id.toString(),
            user.accountData.email,
            expirationDate)
        const passwordRecoveryRequest = await this.passwordRecoveryDbRepository.createPasswordRecoveryRequest(newPasswordRecovery)
        console.log(passwordRecoveryRequest)
        try {
            await this.emailManager.sendPasswordRecoveryCode(passwordRecoveryRequest)
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }

    async newPasswordUpdate(newPassword: NewPasswordInputModel): Promise<boolean> {
        const passwordRecoveryRequest = await this.passwordRecoveryDbRepository
            .findPasswordRecoveryRequest(newPassword.recoveryCode)
        if (!passwordRecoveryRequest) return false
        if (passwordRecoveryRequest.expirationDate < new Date()) return false
        const user = await this.usersDBRepository.findUserById(passwordRecoveryRequest.userId)
        if (!user) return false
        const password = await bcrypt.hash(newPassword.newPassword, 10)
        const isPasswordUpdated = await this.usersDBRepository.newPasswordUpdate(user._id, password)
        if (!isPasswordUpdated) return false
        await this.passwordRecoveryDbRepository.deletePreviousPasswordRecoveryRequest(user._id)
        return true
    }


    async resendConfirmationEmail(email: string): Promise<boolean> {
        const user = await this.usersDBRepository.findUserByLoginOrEmail(email)
        if (!user) return true
        if (user.emailConfirmation.isConfirmed) return false
        const confirmationCodeUpdate: ConfirmationCodeUpdateModel = {
            'emailConfirmation.confirmationCode': randomUUID(),
            'emailConfirmation.expirationDate': add(new Date(), settings.EMAIL_CONFIRMATION_CODE_EXP)
        }
        const isUpdated = await this.usersDBRepository.confirmationCodeUpdate(user._id, confirmationCodeUpdate)
        if (!isUpdated) return false
        const updatedUser = await this.usersDBRepository.findUserById(user._id.toString())
        if (!updatedUser) return false
        try {
            await this.emailManager.sendEmailConfirmationCode(updatedUser)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async createNewPairOfTokes(authInput: AuthInputModel): Promise<AccessRefreshTokensModel | null> {
        const deviceId = randomUUID()
        const newPairOfTokens = await this.jwtService.createAccessRefreshTokens(authInput.userId, deviceId)
        const payload = await this.jwtService.getPayloadOfRefreshToken(newPairOfTokens.refreshToken)
        if (!payload) return null
        const newAuthSession = new DeviceAuthSessionDBType(
            payload.userId,
            payload.deviceId,
            authInput.deviceName,
            authInput.IP,
            payload.issuedAt,
            payload.expiredAt
        )
        await this.deviceAuthSessionsDbRepository.createSession(newAuthSession)
        return newPairOfTokens
    }

    async refreshPairOfTokens(refreshToken: string, activeSession: WithId<DeviceAuthSessionDBType>): Promise<AccessRefreshTokensModel | null> {
        const newPairOfTokens = await this.jwtService.createAccessRefreshTokens(activeSession.userId, activeSession.deviceId)
        const newPayload = await this.jwtService.getPayloadOfRefreshToken(newPairOfTokens.refreshToken)
        const isSessionUpdated = await this.deviceAuthSessionsDbRepository.updateSession(activeSession._id, newPayload!.issuedAt)
        if (!isSessionUpdated) return null
        return newPairOfTokens
    }

    async logOut(sessionId: ObjectId) {
        await this.deviceAuthSessionsDbRepository.deleteSession(sessionId)
    }

    async getDeviceList(userId: string): Promise<DeviceViewModel[]> {
        const tokenValidDate = add(new Date(), {seconds: -settings.JWT_TOKEN.REFRESH_EXP.slice(0, -1)})
        return await this.deviceAuthSessionsDbRepository.getActiveSessions(userId, tokenValidDate)
    }

    async deleteActiveDeviceSessions(userId: string, sessionId: ObjectId) {
        await this.deviceAuthSessionsDbRepository.deleteActiveUserSessions(userId, sessionId)
    }

    async deleteSessionById(sessionId: ObjectId) {
        await this.deviceAuthSessionsDbRepository.deleteSession(sessionId)

    }

    async getDeviceSession(sessionId: string): Promise<WithId<DeviceAuthSessionDBType> | null> {
        return await this.deviceAuthSessionsDbRepository.getSessionByDeviceId(sessionId)
    }
}