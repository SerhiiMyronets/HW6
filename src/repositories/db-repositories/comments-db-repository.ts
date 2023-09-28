import {CommentMongoDBModel} from "../../db/db-models";
import {WithId} from "mongodb";
import {CommentModel} from "../../db/db";

export const commentsDbRepository = {
    async creatComment(newComment: CommentMongoDBModel): Promise<WithId<CommentMongoDBModel> | null> {
        const res = await CommentModel
            .create(newComment)
        return this.findCommentById(res.id);
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
    }
}