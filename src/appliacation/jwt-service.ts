import jwt from "jsonwebtoken"
import {settings} from "../setting";
import {AccessRefreshTokensModel, refreshTokenPayload} from "./jwt-models";
import {deviceAuthSessionsDbRepository} from "../repositories/db-repositories/device-auth-sessions-db-repository";

export const jwtService = {
    async createAccessJWTToken(userId: string) {
        return jwt.sign(
            {userId},
            settings.JWT_TOKEN.SECRET,
            {expiresIn: settings.JWT_TOKEN.ACCESS_EXP})
    },
    async createRefreshJWTToken(userId: string, deviceId: string) {
        return jwt.sign(
            {userId, deviceId},
            settings.JWT_TOKEN.SECRET,
            {expiresIn: settings.JWT_TOKEN.REFRESH_EXP})
    },
    async getUserIdFromAccessToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_TOKEN.SECRET)
            return result.userId
        } catch {
            return null
        }
    },
    async createAccessRefreshTokens(userId: string, deviceId: string): Promise<AccessRefreshTokensModel> {
        return {
            accessToken: await this.createAccessJWTToken(userId),
            refreshToken: await this.createRefreshJWTToken(userId, deviceId)
        }
    },
    async deleteAllTokens(): Promise<Boolean> {
        return deviceAuthSessionsDbRepository.deleteAllSessions()
    },
    async getPayloadOfRefreshToken(refreshToken: string): Promise<refreshTokenPayload| null> {
        try {
            const payload: any = jwt.verify(refreshToken, settings.JWT_TOKEN.SECRET)
            return {
                userId: payload.userId,
                deviceId: payload.deviceId,
                issuedAt: new Date(payload.iat * 1000),
                expiredAt: new Date(payload.exp * 1000)
            }
        } catch {
            return null
        }

    }
}