import {UsersInputModel, UsersViewModel} from "../models/repository/users-models";
import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";


export const usersService = {
    async createUser(body: UsersInputModel): Promise<UsersViewModel | null> {
        const newUser = this._createNewUserBody(body)
        return await usersDbRepository.createUser(newUser)
    },
    _createNewUserBody(body: UsersInputModel) {
        return {
            login: body.login,
            email: body.email,
            password: body.password,
            createdAt: new Date().toISOString()
        }
    }
}