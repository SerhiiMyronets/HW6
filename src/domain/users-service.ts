import {UsersViewModel} from "../models/repository/users-models";
import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";
const bcrypt = require('bcrypt');


export const usersService = {
    async createUser(login: string, password: string, email: string)
        : Promise<UsersViewModel | null> {
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = {
            login,
            password: passwordHash,
            email,
            createdAt: new Date().toISOString()
        }
        return await usersDbRepository.createUser(newUser)
    }

}