import jwt from "jsonwebtoken"
import {UsersViewMongoDB} from "../models/db-models";
import {settings} from "../setting";

export const jwtService = {
    async createJWT(user: UsersViewMongoDB) {
        return jwt
            .sign({userId: user._id}, settings.SECRET_JWT, {expiresIn: '1h'})
    },
    async getUserIdByToken(token: string) {


    }
}