import {ConfirmationCodeUpdateType, UsersInputMongoDB, UsersViewMongoDB} from "../../models/db-models";
import {usersCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const usersDbRepository = {
    async createUser(newUser: UsersInputMongoDB): Promise<UsersViewMongoDB | null> {
        const res = await usersCollection.insertOne(newUser)
        return this.findUserById(res.insertedId.toString());
    },
    async findUserById(id: string): Promise<UsersViewMongoDB | null> {
        return await usersCollection
            .findOne({_id: new ObjectId(id)})
    },
    async deleteUser(id: string): Promise<Boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersViewMongoDB | null> {
        const foundedUser = await usersCollection
            .findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]})
        return foundedUser ? foundedUser : null
    },
    async deleteAllUsers(): Promise<Boolean> {
        await usersCollection
            .deleteMany({})
        return true
    },
    async findUserByConfirmationCode(code: string) {
        return await usersCollection
            .findOne({'emailConfirmation.confirmationCode': code})
    },
    async updateConfirmation(id: ObjectId) {
        const result = await usersCollection
            .updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },
    async confirmationCodeUpdate(_id: ObjectId, updateBody: ConfirmationCodeUpdateType): Promise <boolean> {
        const result = await usersCollection
            .updateOne({_id: _id}, {$set: updateBody})
        return result.modifiedCount === 1
    }
}