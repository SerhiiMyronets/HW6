import {DeviceAuthSessionMongoDBModel} from "../../db/db-models";
import {refreshTokenPayload} from "../../appliacation/jwt-models";
import {ObjectId, WithId} from "mongodb";
import {DeviceViewModel} from "../../models/repository/users-models";
import {mapperDbRepository} from "../mapper-db-repository";
import {DeviceAuthSessionsModel} from "../../db/db";

export const deviceAuthSessionsDbRepository = {
    async createSession(authSession: DeviceAuthSessionMongoDBModel) {
        await DeviceAuthSessionsModel.create(authSession)
    },
    async deleteAllSessions(): Promise<Boolean> {
        await DeviceAuthSessionsModel
            .deleteMany({})
        return true
    },
    async updateSession(_id: ObjectId, issuedAt: Date) {
        const result = await DeviceAuthSessionsModel
            .updateOne({_id},
                {$set: {issuedAt}})
        return result.matchedCount === 1
    },
    async findSessionByPayload(payload: refreshTokenPayload): Promise<WithId<DeviceAuthSessionMongoDBModel> | null> {
        return DeviceAuthSessionsModel
            .findOne({
                issuedAt: payload.issuedAt,
                deviceId: payload.deviceId,
                userId: payload.userId
            })
    }, async deleteSession(_id: ObjectId) {
        await DeviceAuthSessionsModel
            .deleteOne({_id})
    },
    async getActiveSessions(userId: string, tokenValidDate: Date): Promise<DeviceViewModel[]> {
        const sessions = await DeviceAuthSessionsModel
            .find({userId, expiredAt: {$gt: tokenValidDate}})
        return sessions.map(
            b => mapperDbRepository.deviceAuthSessionsModelToDeviceViewModel(b))
    },
    async deleteActiveUserSessions(userId: string, sessionId: ObjectId) {
        await DeviceAuthSessionsModel.deleteMany({userId, _id: {$ne: sessionId}})
    },
    async getUserIdBySessionId(sessionId: string): Promise<string | null> {
        const result = await DeviceAuthSessionsModel.findOne({_id: new ObjectId(sessionId)})
        if (!result) return null
        return result.userId
    },
    async getSessionByDeviceId(deviceId: string): Promise<WithId<DeviceAuthSessionMongoDBModel> | null> {
        return DeviceAuthSessionsModel.findOne({deviceId})
    }
}