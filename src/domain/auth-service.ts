import {usersDbRepository} from "../repositories/db-repositories/users-db-repository";
import {ConfirmationCodeUpdateType, UsersInputMongoDB, UsersViewMongoDB} from "../models/db-models";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";
import {settings} from "../setting";
import {ObjectId} from "mongodb";

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
                expirationDate: add(new Date(), settings.CONFIRMATION_CODE_EXP),
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
    async confirmEmail(id: ObjectId): Promise<boolean> {
        // const user = await usersDbRepository.findUserByConfirmationCode(code)
        // if (!user) return false
        // if (user.emailConfirmation.isConfirmed) return false
        // if (user.emailConfirmation.confirmationCode !== code) return false
        // if (user.emailConfirmation.expirationDate < new Date()) return false
        return await usersDbRepository.updateConfirmation(id);
    },
    async resendConfirmationEmail(email: string): Promise<boolean> {
        const user = await usersDbRepository.findUserByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        const confirmationCodeUpdate: ConfirmationCodeUpdateType = {
            'emailConfirmation.confirmationCode': randomUUID(),
            'emailConfirmation.expirationDate': add(new Date(), settings.CONFIRMATION_CODE_EXP)
        }
        const isUpdated = await usersDbRepository.confirmationCodeUpdate(user._id, confirmationCodeUpdate)
        if (!isUpdated) return false
        const updatedUser = await usersDbRepository.findUserById(user._id.toString())
        if (!updatedUser) return false
        try {
            await emailManager.sendEmailConfirmation(updatedUser)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}