import {CommentMongoDBModel} from "../../db/db-models";
import {ObjectId, WithId} from "mongodb";
import {CommentModel} from "../../db/db";
import {LikeStatusType} from "../../models/repository/comments-models";

export const commentsDbRepository = {
    async creatComment(newComment: CommentMongoDBModel): Promise<string> {
        const res = await CommentModel
            .create(newComment)
        return res.id;
    },
    async findCommentById(_id: string): Promise<WithId<CommentMongoDBModel> | null> {
        return CommentModel.findOne({_id})
    },
    async deleteAllComments(): Promise<boolean> {
        await CommentModel.deleteMany({})
        return true
    },
    async updateComment(_id: string, commentContent: string) {
        const result = await CommentModel
            .updateOne({_id}, {
                $set: {content: commentContent}
            })
        return result.matchedCount === 1
    },
    async deleteComment(_id: string) {
        const result = await CommentModel
            .deleteOne({_id})
        return result.deletedCount === 1
    },
    async updateLikeStatus(_id: string, likeStatus: LikeStatusType, userId: string) {
        const result = await CommentModel.findByIdAndUpdate({_id},
            {
                $cond:
                    {
                        if: {$likeStatus: {$eq: "0"}},
                        then: {$push: {'$likesInfo.likedUsersList': userId}},
                        else: {$push: {'$likesInfo.dislikedUsersList': userId}}
                    }
            })
        console.log(result)
        // console.log(CommentModel.findOne({_id}))
        return true
    },
    async getCommentStatus(_id: string, userId: string): Promise<string> {
        const status = await CommentModel.aggregate([
            {$match: {_id: new ObjectId(_id)}},
            {
                $addFields: {
                    likesStatus: {
                        $cond: {
                            if:  {$in: [userId, '$likesInfo.likedUsersList']},
                            then: 'Like',
                            else: {
                                $cond: {
                                    if: {$in: [userId, '$likesInfo.dislikedUsersList']},
                                    then: 'Dislike',
                                    else: 'None'
                                }
                            }
                        }
                    }
                }
            }, {
                $project: {
                    likesStatus: 1,
                    _id: 0
                }
            }]
        )
        return status[0].likesStatus
    },
    async removeDislike(_id: string, userId: string) {
        await CommentModel.findByIdAndUpdate({_id: new ObjectId(_id)},
            {$pull: {'likesInfo.dislikedUsersList': userId}})
    },
    async removeLike(_id: string, userId: string) {
        await CommentModel.findByIdAndUpdate({_id: new ObjectId(_id)},
            {$pull: {'likesInfo.likedUsersList': userId}})
    },
    async addLike(_id: string, userId: string) {
        await CommentModel.findByIdAndUpdate({_id: new ObjectId(_id)},
            {$push: {'likesInfo.likedUsersList': userId}})
    },
    async addDislike(_id: string, userId: string) {
        await CommentModel.findByIdAndUpdate({_id: new ObjectId(_id)},
            {$push: {'likesInfo.dislikedUsersList': userId}})
    },
}