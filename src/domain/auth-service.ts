import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";
import {UsersInputMongoDB, UsersViewMongoDB} from "../models/db-models";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";

const bcrypt = require('bcrypt');


export const authService = {
    async checkCredentials(login: string, pass: string) {
        const user = await usersDbRepository.findUserByLoginOrEmail(login)
        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null
        if (await bcrypt.compare(pass, user.accountData.password))
            return user
        else
            return null
    },
    async createUser(login: string, email: string, pass: string): Promise<UsersViewMongoDB | null> {
        const password = await bcrypt.hash(pass, 10)
        const user: UsersInputMongoDB = {
            accountData: {
                login,
                email,
                password,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const createdUser = await usersDbRepository.createUser(user)
        if (createdUser)
            try {
                await emailManager.sendEmailConfirmation(createdUser)
            } catch (error) {
                console.error(error)
                await usersDbRepository.deleteUser(createdUser._id.toString())
                return null
            }
        return createdUser
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersDbRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        return await usersDbRepository.updateConfirmation(user._id);
    },
    async resendConfirmationEmail(email: string): Promise<boolean>  {
        const user = await usersDbRepository.findUserByLoginOrEmail(email)
        console.log(user)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        console.log(1)
        try {
            await emailManager.sendEmailConfirmation(user)
        } catch (error) {
            console.error(error)
            await usersDbRepository.deleteUser(user._id.toString())
            return false
        }
        return true
    }
}