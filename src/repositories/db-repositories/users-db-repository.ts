import {ConfirmationCodeUpdateType, passwordRecoveryModel, UsersMongoDBModel} from "../../db/db-models";
import {usersCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";

export const usersDbRepository = {
    async createUser(newUser: UsersMongoDBModel): Promise<WithId<UsersMongoDBModel> | null> {
        const res = await usersCollection.insertOne(newUser)
        return this.findUserById(res.insertedId.toString());
    },
    async findUserById(id: string): Promise<WithId<UsersMongoDBModel> | null> {
        return await usersCollection
            .findOne({_id: new ObjectId(id)})
    },
    async deleteUser(id: string): Promise<Boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UsersMongoDBModel> | null> {
        const foundedUser = await usersCollection
            .findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]})
        return foundedUser ? foundedUser : null
    },
    async findUserByEmail(email: string): Promise<WithId<UsersMongoDBModel> | null> {
        const foundedUser = await usersCollection
            .findOne({"accountData.email": email})
        return foundedUser ? foundedUser : null
    },
    async deleteAllUsers(): Promise<Boolean> {
        await usersCollection
            .deleteMany({})
        return true
    },
    async findUserByEmailConfirmationCode(code: string) {
        return await usersCollection
            .findOne({'emailConfirmation.confirmationCode': code})
    },
    async updateConfirmation(id: ObjectId) {
        const result = await usersCollection
            .updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },
    async confirmationCodeUpdate(_id: ObjectId, updateBody: ConfirmationCodeUpdateType): Promise<boolean> {
        const result = await usersCollection
            .updateOne({_id: _id}, {$set: updateBody})
        return result.modifiedCount === 1
    },
    async updatePasswordRecovery(_id: ObjectId, passwordRecovery: passwordRecoveryModel): Promise<WithId<UsersMongoDBModel> | null> {
        const result = await usersCollection
            .findOneAndUpdate({_id}, {$set: {"passwordRecovery": passwordRecovery}})
        return result.value
    },
    async findUserByNewPasswordConfirmationCode(recoveryCode: string) {
        return usersCollection
            .findOne({'passwordRecovery.confirmationCode': recoveryCode})
    },
    async newPasswordUpdate(_id: ObjectId, password: string): Promise<Boolean> {
        const result = await usersCollection
            .updateOne({_id}, {$set: {'accountData.password': password}})
        return result.modifiedCount === 1
    }
}