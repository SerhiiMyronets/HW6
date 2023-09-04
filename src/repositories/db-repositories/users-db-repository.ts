import {UsersInputMongoDB, UsersViewMongoDB} from "../../models/db-models";
import {usersCollection} from "../../db/db";
import {mapperDbRepository} from "../mapper-db-repository";
import {ObjectId} from "mongodb";
import {UsersViewModel} from "../../models/repository/users-models";

export const usersDbRepository = {
    async createUser(newUser: UsersInputMongoDB): Promise <UsersViewModel | null> {
        const res = await usersCollection.insertOne(newUser)
        return this.findUserById(res.insertedId.toString());
    },
    async findUserById(id: string): Promise<UsersViewModel | null> {
        const result = await usersCollection
            .findOne({_id: new ObjectId(id)})
        if (result) {
            return mapperDbRepository.userOutputMongoDBtoUsersViewMongo(result)
        } else {
            return null
        }
    },
    async deleteUser(id: string): Promise<Boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UsersViewMongoDB | null> {
        const foundedUser = await usersCollection
            .findOne({ $or:[{"login": loginOrEmail}, {"email": loginOrEmail}]})
        return foundedUser ? foundedUser : null
    },
    async deleteAllUsers(): Promise<Boolean> {
        await usersCollection
            .deleteMany({})
        return true
    }
}