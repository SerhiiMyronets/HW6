import { UsersBDType} from "../../db/db-models";
import {ObjectId, WithId} from "mongodb";
import {UserModel} from "../../db/db";
import {ConfirmationCodeUpdateModel} from "../../models/repository/users-models";

export class UsersDBRepository {
    async createUser(newUser: UsersBDType): Promise<string> {
        const res = await UserModel.create(newUser)
        return res._id.toString()
    }
    async findUserById(_id: string): Promise<WithId<UsersBDType> | null> {
        return UserModel
            .findOne({_id});
    }
    async deleteUser(_id: string): Promise<Boolean> {
        const result = await UserModel.deleteOne({_id})
        return result.deletedCount === 1
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UsersBDType> | null> {
        return UserModel
            .findOne({
                $or: [{"accountData.login": loginOrEmail},
                    {"accountData.email": loginOrEmail}]
            });
    }
    async findUserByEmail(email: string): Promise<WithId<UsersBDType> | null> {
        return UserModel
            .findOne({"accountData.email": email});
    }
    async deleteAllUsers(): Promise<Boolean> {
        await UserModel
            .deleteMany({})
        return true
    }
    async findUserByEmailConfirmationCode(code: string) {
        return UserModel
            .findOne({'emailConfirmation.confirmationCode': code})
    }
    async updateConfirmation(_id: ObjectId) {
        const result = await UserModel
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
    async confirmationCodeUpdate(_id: ObjectId, updateBody: ConfirmationCodeUpdateModel): Promise<boolean> {
        const result = await UserModel
            .updateOne({_id}, {$set: updateBody})
        return result.modifiedCount === 1
    }
    async newPasswordUpdate(_id: ObjectId, password: string): Promise<Boolean> {
        const result = await UserModel
            .updateOne({_id}, {$set: {'accountData.password': password}})
        return result.modifiedCount === 1
    }
}