import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";
import {ConfirmationCodeUpdateType, DeviceAuthSessionsModel, UsersMongoDBModel} from "../db/db-models";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";
import {settings} from "../setting";
import {WithId} from "mongodb";
import {AccessRefreshTokensModel, authInputModel} from "../appliacation/jwt-models";
import {deviceAuthSessionsDbRepository} from "../repositories/db-repositories/device-auth-sessions-db-repository";
import {jwtService} from "../appliacation/jwt-service";
import {log} from "util";
import {deviceAuthSessionsCollection} from "../db/db";

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
                expirationDate: add(new Date(), settings.CONFIRMATION_CODE_EXP),
                isConfirmed: false
            }
        }
        const createdUser = await usersDbRepository.createUser(user)
        if (createdUser)
            try {
                await emailManager.sendEmailConfirmation(createdUser)
            } catch (error) {
                console.error(error)
                await usersDbRepository.deleteUser(createdUser._id.toString())
                return null
            }
        return createdUser
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersDbRepository.findUserByConfirmationCode(code)
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
            'emailConfirmation.expirationDate': add(new Date(), settings.CONFIRMATION_CODE_EXP)
        }
        const isUpdated = await usersDbRepository.confirmationCodeUpdate(user._id, confirmationCodeUpdate)
        if (!isUpdated) return false
        const updatedUser = await usersDbRepository.findUserById(user._id.toString())
        if (!updatedUser) return false
        try {
            await emailManager.sendEmailConfirmation(updatedUser)
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
    async logOut(refreshToken: string) {
        const payload = await jwtService.getPayloadOfRefreshToken(refreshToken)
        const sessionId = await deviceAuthSessionsDbRepository.findSessionByPayload(payload!)
    }
}