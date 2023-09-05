import {UsersViewModel} from "../models/repository/users-models";
import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";
const bcrypt = require('bcrypt');


export const usersService = {
    async createUser(login: string, pass: string, email: string)
        : Promise<UsersViewModel | null> {
        const password = await bcrypt.hash(pass, 10)
        const newUser = {
            accountData: {
                login,
                email,
                password,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: '',
                isConfirmed: true
            }
        }
        return await usersDbRepository.createUser(newUser)
    },
    async deleteUser(id: string): Promise<Boolean> {
        return await usersDbRepository.deleteUser(id)
    },
    async deleteAllUsers(): Promise<Boolean> {
        return usersDbRepository.deleteAllUsers()
    }
}