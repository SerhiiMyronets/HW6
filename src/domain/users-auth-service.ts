import {UsersViewModel} from "../models/repository/users-models";
import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";
const bcrypt = require('bcrypt');


export const usersAuthService = {
    async createUser(login: string, pass: string, email: string)
        : Promise<UsersViewModel | null> {
        const passwordHash = await bcrypt.hash(pass, 10)
        const newUser = {
            login,
            password: passwordHash,
            email,
            createdAt: new Date().toISOString()
        }
        return await usersDbRepository.createUser(newUser)
    },
    async deleteUser(id: string): Promise<Boolean> {
        return await usersDbRepository.deleteUser(id)
    },
    async checkCredentials(login: string, pass: string) {
        const user = await usersDbRepository.findUserByLoginOrEmail(login)
        if (!user) {
            return null
        }
        if (await bcrypt.compare(pass, user.password)) {
            return user
        } else {
            return null
        }
    },
    async deleteAllUsers(): Promise<Boolean> {
        return usersDbRepository.deleteAllUsers()
    }
}