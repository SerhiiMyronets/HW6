import {deviceAuthSessionsCollection} from "../../db/db";
import {DeviceAuthSessionsModel} from "../../db/db-models";
import {refreshTokenPayload} from "../../appliacation/jwt-models";
import {ObjectId, WithId} from "mongodb";

export const deviceAuthSessionsDbRepository = {
    async createSession(authSession: DeviceAuthSessionsModel) {
        await deviceAuthSessionsCollection.insertOne(authSession)
    },
    async deleteAllTokens(): Promise<Boolean> {
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
    }
}