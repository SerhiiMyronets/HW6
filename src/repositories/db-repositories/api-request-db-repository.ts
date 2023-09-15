import {apiRequestDatabase} from "../../db/db-models";
import {apiRequestDatabaseCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import add from "date-fns/add";
import {settings} from "../../setting";

export const apiRequestDbRepository = {
    async addRequest(request: apiRequestDatabase): Promise<ObjectId> {
        const result = await apiRequestDatabaseCollection.insertOne(request)
        return result.insertedId
    },
    async getRequestByIP(request: apiRequestDatabase) {
const result = await apiRequestDatabaseCollection
    .find({'IP': request.IP, 'date': {$gt: add(request.date, settings.REQUEST_TIME_LIMIT)}})
    }
}