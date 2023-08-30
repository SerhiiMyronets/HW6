import jwt from "jsonwebtoken"
import {UsersViewMongoDB} from "../models/db-models";
import {settings} from "../setting";

export const jwtService = {
    async createJWT(user: UsersViewMongoDB) {
        const token = jwt.sign({userId: user._id}, settings.SECRET_JWT, {expiresIn: '1w'})
        return {
            "accessToken": token
        }
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.SECRET_JWT)
            return result.userId
        } catch (error) {
            return null
        }

    }
}