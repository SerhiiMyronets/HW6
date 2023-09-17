import {deviceAuthSessionsCollection} from "../../db/db";
import {DeviceAuthSessionsModel} from "../../db/db-models";
import {refreshTokenPayload} from "../../appliacation/jwt-models";
import {ObjectId, WithId} from "mongodb";
import {DeviceViewModel} from "../../models/repository/users-models";
import {mapperDbRepository} from "../mapper-db-repository";

export const deviceAuthSessionsDbRepository = {
    async createSession(authSession: DeviceAuthSessionsModel) {
        await deviceAuthSessionsCollection.insertOne(authSession)
    },
    async deleteAllSessions(): Promise<Boolean> {
        await deviceAuthSessionsCollection
            .deleteMany({})
        return true
    },
    async updateSession(_id: ObjectId, issuedAt: Date) {
        const updatedSession = await deviceAuthSessionsCollection
            .updateOne({_id},
                {$set: {issuedAt}})
        return !!updatedSession
    },
    async findSessionByPayload(payload: refreshTokenPayload): Promise<WithId<DeviceAuthSessionsModel> | null> {
        const session = await deviceAuthSessionsCollection.findOne({
            issuedAt: payload.issuedAt,
            deviceId: payload.deviceId,
            userId: payload.userId
        })
        if (!session) return null
        return session
    }, async deleteSession(_id: ObjectId) {
        await deviceAuthSessionsCollection.deleteOne({_id})
    },
    async getActiveSessions(userId: string, tokenValidDate: Date): Promise<DeviceViewModel[]> {
        const sessions = await deviceAuthSessionsCollection
            .find({userId, expiredAt: {$gt: tokenValidDate}})
            .toArray()
        return sessions.map(
            b => mapperDbRepository.deviceAuthSessionsModelToDeviceViewModel(b))
    },
    async deleteActiveUserSessions(userId: string, sessionId: ObjectId) {
        await deviceAuthSessionsCollection.deleteMany({userId, _id: {$ne: sessionId}})
    },
    async getUserIdBySessionId(sessionId: string): Promise<string | null> {
        const result = await deviceAuthSessionsCollection.findOne({_id: new ObjectId(sessionId)})
        if (!result) return null
        return result.userId
    },
    async getSessionByDeviceId(deviceId: string): Promise<WithId<DeviceAuthSessionsModel> | null> {
        return deviceAuthSessionsCollection.findOne({deviceId})
    }
}