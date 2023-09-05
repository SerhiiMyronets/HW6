import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";

const bcrypt = require('bcrypt');


export const authService = {
    async checkCredentials(login: string, pass: string) {
        const user = await usersDbRepository.findUserByLoginOrEmail(login)
        if (!user) {
            return null
        }
        if (await bcrypt.compare(pass, user.accountData.password)) {
            return user
        } else {
            return null
        }
    }
}