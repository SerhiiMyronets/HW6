import {ApiRequestDatabaseModel} from "../../db/db-models";
import {apiRequestDatabaseCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const apiRequestDbRepository = {
    async addRequest(request: ApiRequestDatabaseModel): Promise<ObjectId> {
        const result = await apiRequestDatabaseCollection.insertOne(request)
        return result.insertedId
    },
    async getRequestByIP(request: ApiRequestDatabaseModel, requestValidDate: Date) {
        return apiRequestDatabaseCollection
            .find({'IP': request.IP, 'URL': request.URL,  'date': {$gt: requestValidDate}})
            .toArray()
    }
}