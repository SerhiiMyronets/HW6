import {PasswordRecoveryDBType} from "../../db/db-models";
import {ObjectId, WithId} from "mongodb";
import {PasswordRecoveryModel} from "../../db/db";

export class PasswordRecoveryDbRepository {
    async createPasswordRecoveryRequest(passwordRecovery: PasswordRecoveryDBType): Promise<WithId<PasswordRecoveryDBType>> {
        return await PasswordRecoveryModel
            .create(passwordRecovery)
    }

    async findPasswordRecoveryRequest(confirmationCode: string): Promise<WithId<PasswordRecoveryDBType> | null> {
        return PasswordRecoveryModel
            .findOne({confirmationCode});
    }

    async deletePreviousPasswordRecoveryRequest(userId: ObjectId): Promise<boolean> {
        await PasswordRecoveryModel
            .deleteMany({userId})
        return true
    }
}