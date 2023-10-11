import {CommentDBType} from "../../db/db-models";
import {ObjectId, WithId} from "mongodb";
import {CommentModel} from "../../db/db";

export class CommentsDbRepository {
    async creatComment(newComment: CommentDBType): Promise<string> {
        const res = await CommentModel
            .create(newComment)
        return res._id.toString();
    }

    async findCommentById(_id: string): Promise<WithId<CommentDBType> | null> {
        return CommentModel.findById({_id})
    }

    async getCommentStatus(_id: string, userId: string): Promise<string> {
        const status = await CommentModel.aggregate([
            {$match: {_id: new ObjectId(_id)}},
            {
                $addFields: {
                    likesStatus: {
                        $cond: {
                            if: {$in: [userId, '$likesInfo.likedUsersList']},
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
    }

    async deleteAllComments(): Promise<boolean> {
        await CommentModel.deleteMany({})
        return true
    }

    async updateComment(_id: string, commentContent: string) {
        const result = await CommentModel
            .updateOne({_id}, {
                $set: {content: commentContent}
            })
        return result.matchedCount === 1
    }

    async deleteComment(_id: string) {
        const result = await CommentModel
            .deleteOne({_id})
        return result.deletedCount === 1
    }

    async increaseLikesCount(id: string) {
        await CommentModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'likesInfo.likesCount': 1}})
    }

    async increaseLikesAndDecreaseDislikeCount(id: string) {
        await CommentModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1}})
    }

    async increaseDislikeCount(id: string) {
        await CommentModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'likesInfo.dislikesCount': 1}})
    }
    async increaseDislikeAndDecreaseLikeCount(id: string) {
        await CommentModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1}})
    }

    async decreaseLikeCount(id: string) {
        await CommentModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'likesInfo.likesCount': -1}})
    }

    async decreaseDislikeCount(id: string) {
        await CommentModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'likesInfo.dislikesCount': -1}})
    }
}


