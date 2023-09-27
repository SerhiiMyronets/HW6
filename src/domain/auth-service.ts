import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";
import {
    ConfirmationCodeUpdateType,
    DeviceAuthSessionsModel,
    passwordRecoveryModel,
    UsersMongoDBModel
} from "../db/db-models";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";
import {settings} from "../setting";
import {ObjectId, WithId} from "mongodb";
import {AccessRefreshTokensModel, authInputModel} from "../appliacation/jwt-models";
import {deviceAuthSessionsDbRepository} from "../repositories/db-repositories/device-auth-sessions-db-repository";
import {jwtService} from "../appliacation/jwt-service";
import {DeviceViewModel, NewPasswordInputModel} from "../models/repository/users-models";

const bcrypt = require('bcrypt');


export const authService = {
    async checkCredentials(login: string, pass: string) {
        const user = await usersDbRepository.findUserByLoginOrEmail(login)
        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null
        if (await bcrypt.compare(pass, user.accountData.password))
            return user
        else
            return null
    },
    async createUser(login: string, email: string, pass: string): Promise<WithId<UsersMongoDBModel> | null> {
        const password = await bcrypt.hash(pass, 10)
        const user: UsersMongoDBModel = {
            accountData: {
                login,
                email,
                password,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), settings.EMAIL_CONFIRMATION_CODE_EXP),
                isConfirmed: false
            },
            passwordRecovery: {
                confirmationCode: '',
                expirationDate: new Date,
            }
        }
        const createdUser = await usersDbRepository.createUser(user)
        if (createdUser)
            try {
                await emailManager.sendEmailConfirmationCode(createdUser)
            } catch (error) {
                console.error(error)
                await usersDbRepository.deleteUser(createdUser._id.toString())
                return null
            }
        return createdUser
    },
    async passwordRecovery(email: string): Promise<boolean> {
        const user = await usersDbRepository.findUserByEmail(email)
        if (!user) return true
        const passwordRecovery: passwordRecoveryModel = {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), settings.PASSWORD_RECOVERY_CONFIRMATION_CODE_EXP)
        }
        const updatedUser = await usersDbRepository.updatePasswordRecovery(user._id, passwordRecovery)
        if (updatedUser)
            try {
                await emailManager.sendPasswordRecoveryCode(updatedUser)
            } catch (error) {
                console.error(error)
                return false
            }
        return true
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersDbRepository.findUserByEmailConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        return await usersDbRepository.updateConfirmation(user._id);
    },
    async resendConfirmationEmail(email: string): Promise<boolean> {
        const user = await usersDbRepository.findUserByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        const confirmationCodeUpdate: ConfirmationCodeUpdateType = {
            'emailConfirmation.confirmationCode': randomUUID(),
            'emailConfirmation.expirationDate': add(new Date(), settings.EMAIL_CONFIRMATION_CODE_EXP)
        }
        const isUpdated = await usersDbRepository.confirmationCodeUpdate(user._id, confirmationCodeUpdate)
        if (!isUpdated) return false
        const updatedUser = await usersDbRepository.findUserById(user._id.toString())
        if (!updatedUser) return false
        try {
            await emailManager.sendEmailConfirmationCode(updatedUser)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    },
    async createNewPairOfTokes(authInput: authInputModel): Promise<AccessRefreshTokensModel | null> {
        const deviceId = randomUUID()
        const newPairOfTokens = await jwtService.createAccessRefreshTokens(authInput.userId, deviceId)
        const payload = await jwtService.getPayloadOfRefreshToken(newPairOfTokens.refreshToken)
        if (!payload) return null
        const authSession: DeviceAuthSessionsModel = {
            userId: payload.userId,
            deviceId: payload.deviceId,
            deviceName: authInput.deviceName,
            IP: authInput.IP,
            issuedAt: payload.issuedAt,
            expiredAt: payload.expiredAt
        }
        await deviceAuthSessionsDbRepository.createSession(authSession)
        return newPairOfTokens
    },
    async refreshPairOfTokens(refreshToken: string, activeSession: WithId<DeviceAuthSessionsModel>): Promise<AccessRefreshTokensModel | null> {
        const newPairOfTokens = await jwtService.createAccessRefreshTokens(activeSession.userId, activeSession.deviceId)
        const newPayload = await jwtService.getPayloadOfRefreshToken(newPairOfTokens.refreshToken)
        const isSessionUpdated = await deviceAuthSessionsDbRepository.updateSession(activeSession._id, newPayload!.issuedAt)
        if (!isSessionUpdated) return null
        return newPairOfTokens
    },
    async logOut(sessionId: ObjectId) {
        await deviceAuthSessionsDbRepository.deleteSession(sessionId)
    },
    async getDeviceList(userId: string): Promise<DeviceViewModel[]> {
        const tokenValidDate = add(new Date(), {seconds: -settings.JWT_TOKEN.REFRESH_EXP.slice(0, -1)})
        return await deviceAuthSessionsDbRepository.getActiveSessions(userId, tokenValidDate)
    },
    async deleteAllSessions() {
        await deviceAuthSessionsDbRepository.deleteAllSessions()
    },
    async deleteActiveDeviceSessions(userId: string, sessionId: ObjectId) {
        await deviceAuthSessionsDbRepository.deleteActiveUserSessions(userId, sessionId)
    },
    async deleteSessionById(sessionId: ObjectId) {
        await deviceAuthSessionsDbRepository.deleteSession(sessionId)

    },
    async getDeviceSession(sessionId: string): Promise<WithId<DeviceAuthSessionsModel> | null> {
        return await deviceAuthSessionsDbRepository.getSessionByDeviceId(sessionId)
    },
    async newPasswordUpdate(newPassword: NewPasswordInputModel): Promise<boolean> {
        const user = await usersDbRepository.findUserByNewPasswordConfirmationCode(newPassword.recoveryCode)
        if (!user) return false
        if (user.passwordRecovery.expirationDate < new Date()) return false
        const password = await bcrypt.hash(newPassword.newPassword, 10)
        const isPasswordUpdated = await usersDbRepository.newPasswordUpdate(user._id, password)
        if (!isPasswordUpdated) return false
        return true
    }
}