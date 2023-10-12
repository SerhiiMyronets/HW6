import {DeviceAuthSessionDBType} from "../../db/db-models";
import {RefreshTokenPayloadModel} from "../../appliacation/jwt-models";
import {ObjectId, WithId} from "mongodb";
import {DeviceViewModel} from "../../models/repository/users-models";
import {DeviceAuthSessionsModel} from "../../db/db";

export class DeviceAuthSessionsDbRepository {
    async createSession(authSession: DeviceAuthSessionDBType) {
        await DeviceAuthSessionsModel.create(authSession)
    }

    async deleteAllSessions(): Promise<Boolean> {
        await DeviceAuthSessionsModel
            .deleteMany({})
        return true
    }

    async updateSession(_id: ObjectId, issuedAt: Date) {
        const result = await DeviceAuthSessionsModel
            .updateOne({_id},
                {$set: {issuedAt}})
        return result.matchedCount === 1
    }

    async findSessionByPayload(payload: RefreshTokenPayloadModel): Promise<WithId<DeviceAuthSessionDBType> | null> {
        return DeviceAuthSessionsModel
            .findOne({
                issuedAt: payload.issuedAt,
                deviceId: payload.deviceId,
                userId: payload.userId
            })
    }

    async deleteSession(_id: ObjectId) {
        await DeviceAuthSessionsModel
            .deleteOne({_id})
    }

    async getActiveSessions(userId: string, tokenValidDate: Date): Promise<DeviceViewModel[]> {
        return DeviceAuthSessionsModel
            .find({userId, expiredAt: {$gt: tokenValidDate}}, {
                _id: 0,
                ip: '$IP',
                title: '$deviceName',
                lastActiveDate: '$issuedAt',
                deviceId: 1
            }).lean()
    }

    async deleteActiveUserSessions(userId: string, sessionId: ObjectId) {
        await DeviceAuthSessionsModel.deleteMany({userId, _id: {$ne: sessionId}})
    }

    async getUserIdBySessionId(sessionId: string): Promise<string | null> {
        const result = await DeviceAuthSessionsModel.findOne({_id: new ObjectId(sessionId)})
        if (!result) return null
        return result.userId
    }

    async getSessionByDeviceId(deviceId: string): Promise<WithId<DeviceAuthSessionDBType> | null> {
        return DeviceAuthSessionsModel.findOne({deviceId})
    }
}