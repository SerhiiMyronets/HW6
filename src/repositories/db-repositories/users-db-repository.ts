import {UsersInputMongoDB} from "../../models/db-models";
import {usersCollection} from "../../db/db";
import {mapperRepository} from "../mapper-repository";
import {ObjectId} from "mongodb";
import {UsersViewModel} from "../../models/repository/users-models";

export const usersDbRepository = {
    async createUser(newUser: UsersInputMongoDB) {
        const res = await usersCollection.insertOne(newUser)
        return this.findUserById(res.insertedId.toString());
    },
    async findUserById(id: string): Promise<UsersViewModel | null> {
        console.log(id)
        const result = await usersCollection
            .findOne({_id: new ObjectId(id)})
        if (result) {
            console.log(result)
            return mapperRepository.userOutputMongoDBtoUsersViewMongo(result)
        } else {
            return null
        }
    }
}