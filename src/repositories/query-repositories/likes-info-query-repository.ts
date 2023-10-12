import {LikeInfoModel} from "../../db/db";
import {LikesStatusQueryModel} from "../../models/repository/comments-models";

export class LikesInfoQueryRepository {
    async getLikeStatus(userId: string, objectType: string, objectId: string): Promise<string> {
        const likeInfo = await LikeInfoModel
            .findOne({userId, objectType, objectId})
        if (likeInfo)
            return likeInfo.likeStatus
        else
            return "None"
    }

    async getCommentsLikeStatusByPost(postId: string, userId: string): Promise<LikesStatusQueryModel> {
        return LikeInfoModel.find({userId, parentObjectId: postId, likeStatus: {$ne: "None"} },
            {
                _id: 0,
                id: '$objectId',
                likeStatus: 1
            }).lean()
    }
}