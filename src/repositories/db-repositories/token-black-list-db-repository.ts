import {tokenBlackListCollection, usersCollection} from "../../db/db";
import {RefreshTokenBlackListMongoInputDB} from "../../db/db-models";

export const tokenBlackListDbRepository = {
    async isTokenInBlackList(token: string): Promise<boolean> {
        const tokenDB = await tokenBlackListCollection
            .findOne({refreshToken: token})
        return !!tokenDB;
    },
    async addToken(id: string, token: string) {
        const tokenDB: RefreshTokenBlackListMongoInputDB = {
            userId: id,
            refreshToken: token
        }
        await tokenBlackListCollection.insertOne(tokenDB)
    },
    async deleteAllTokens(): Promise<Boolean> {
        await usersCollection
            .deleteMany({})
        return true
    }
}