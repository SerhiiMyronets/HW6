import {UsersDBRepository} from "../repositories/db-repositories/users-db-repository";


const bcrypt = require('bcrypt');


export class UsersService {
    constructor(protected usersDBRepository: UsersDBRepository) {
    }

    async createUser(login: string, pass: string, email: string): Promise<string> {
        const password = await bcrypt.hash(pass, 10)
        const newUser = {
            accountData: {
                login,
                email,
                password,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: new Date(),
                isConfirmed: true
            }
        }
        return this.usersDBRepository.createUser(newUser)
    }


    async deleteUser(id: string): Promise<Boolean> {
        return await this.usersDBRepository.deleteUser(id)
    }


    async deleteAllUsers(): Promise<Boolean> {
        return this.usersDBRepository.deleteAllUsers()
    }
}