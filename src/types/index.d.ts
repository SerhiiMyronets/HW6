import {UsersViewMongoDB} from "../models/db-models";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersViewMongoDB | null
        }
    }
}