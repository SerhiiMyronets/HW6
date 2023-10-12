import {DeviceAuthSessionDBType, UsersBDType} from "../db/db-models";
import {WithId} from "mongodb";

declare global {
    declare namespace Express {
        export interface Request {
            user: WithId<UsersBDType> | null,
            session: WithId<DeviceAuthSessionDBType> | null
        }
    }
}