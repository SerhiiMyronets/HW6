import {ApiRequestDatabaseModel} from "../../db/db-models";
import {apiRequestDatabaseCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import add from "date-fns/add";
import {settings} from "../../setting";

export const apiRequestDbRepository = {
    async addRequest(request: ApiRequestDatabaseModel): Promise<ObjectId> {
        const result = await apiRequestDatabaseCollection.insertOne(request)
        return result.insertedId
    },
    async getRequestByIP(request: ApiRequestDatabaseModel) {
        return apiRequestDatabaseCollection
            .find({'IP': request.IP, 'date': {$gt: add(request.date, settings.REQUEST_TIME_LIMIT)}})
            .toArray()

    }
}