import {LikeInfoType} from "../../db/db-models";
import {LikeInfoModel} from "../../db/db";
import {ObjectId} from "mongodb";
import {HydratedDocument} from "mongoose";
import {newestLikesViewModel} from "../../models/repository/posts-models";

export class LikesInfoDbRepository {
    async addLikeInfo(likeInfo: LikeInfoType): Promise<ObjectId> {
        const res = await LikeInfoModel
            .create(likeInfo)
        return res._id;
    }

    async findLikeInfo(userId: string, objectType: string, objectId: string): Promise<HydratedDocument<LikeInfoType> | null> {
        const likeInfo = await LikeInfoModel.findOne({userId, objectType, objectId})
        return (likeInfo) ? likeInfo : null
    }

    async setLikeStatus(_id: ObjectId) {
        await LikeInfoModel.findOneAndUpdate({_id}, {likeStatus: 'Like'})
    }

    async setDislikeStatus(_id: ObjectId) {
        await LikeInfoModel.findOneAndUpdate({_id}, {likeStatus: 'Dislike'})
    }

    async setNoneStatus(_id: ObjectId) {
        await LikeInfoModel.findOneAndUpdate({_id}, {likeStatus: 'None'})
    }

    async findNewestThreeLikes(objectId: string): Promise<newestLikesViewModel[] | null> {
        return LikeInfoModel
            .find({objectId: new ObjectId(objectId), likeStatus: 'Like'}, {
                _id: 0,
                login: '$userLogin',
                userId: '$userId',
                addedAt: '$createdAt',
            })
            .sort({createdAt: -1})
            .limit(3)
            .lean()
    }
}
