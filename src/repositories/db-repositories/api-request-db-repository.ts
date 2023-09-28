import {ApiRequestDatabaseMongoDBModel} from "../../db/db-models";
import {ObjectId} from "mongodb";
import {ApiRequestDatabaseModel} from "../../db/db";

export const apiRequestDbRepository = {
    async addRequest(request: ApiRequestDatabaseMongoDBModel): Promise<ObjectId> {
        const result = await ApiRequestDatabaseModel
            .create(request)
        return result.id
    },
    async getRequestByIP(request: ApiRequestDatabaseMongoDBModel, requestValidDate: Date) {
        return ApiRequestDatabaseModel
            .find({'IP': request.IP, 'URL': request.URL, 'date': {$gt: requestValidDate}})
    },
    async deleteAllRequest() {
        await ApiRequestDatabaseModel
            .deleteMany()
        return true
    }
}