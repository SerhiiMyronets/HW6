import {UsersViewModel} from "../models/repository/users-models";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersViewModel | null
        }
    }
}