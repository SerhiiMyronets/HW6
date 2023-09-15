import {UsersMongoDBModel} from "../db/db-models";
import {WithId} from "mongodb";

declare global {
    declare namespace Express {
        export interface Request {
            user: WithId<UsersMongoDBModel> | null
        }
    }
}