import jwt from "jsonwebtoken"
import {UsersViewMongoDB} from "../models/db-models";
import {settings} from "../setting";
import {AccessRefreshTokensModel} from "./jwt-models";
import {tokenBlackListDbRepository} from "../repositories/db-repositories/token-black-list-db-repository";

export const jwtService = {
    async createAccessJWTToken(user: UsersViewMongoDB) {
        return jwt.sign(
            {userId: user._id},
            settings.JWT_TOKEN.SECRET,
            {expiresIn: settings.JWT_TOKEN.ACCESS_EXP})
    },
    async createRefreshJWTToken(user: UsersViewMongoDB) {
        return jwt.sign(
            {userId: user._id},
            settings.JWT_TOKEN.SECRET,
            {expiresIn: settings.JWT_TOKEN.REFRESH_EXP})
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_TOKEN.SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    },
    async createAccessRefreshTokens(user: UsersViewMongoDB): Promise<AccessRefreshTokensModel> {
        return {
            accessToken: await this.createAccessJWTToken(user),
            refreshToken: await this.createRefreshJWTToken(user)
        }
    },
    async deleteAllTokens(): Promise<Boolean> {
        return tokenBlackListDbRepository.deleteAllTokens()
    }
}