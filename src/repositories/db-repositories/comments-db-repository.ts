import {CommentMongoDBModel} from "../../db/db-models";
import {commentsCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";

export const commentsDbRepository = {
    async creatComment(newComment: CommentMongoDBModel): Promise<WithId<CommentMongoDBModel> | null> {
        const res = await commentsCollection
            .insertOne(newComment)
        return this.findCommentById(res.insertedId.toString());
    },
    async findCommentById(id: string): Promise<WithId<CommentMongoDBModel> | null> {
        const result = await commentsCollection
            .findOne({_id: new ObjectId(id)}, )
        if (result) {
            return result
        } else {
            return null
        }
    },
    async deleteAllComments(): Promise<boolean> {
        await commentsCollection
            .deleteMany({})
        return true
    },
    async updateComment(commentId: string, commentContent: string) {
        const result = await commentsCollection
            .updateOne({_id: new ObjectId(commentId)}, {
                $set: {content: commentContent}
            })
        return result.matchedCount === 1
    },
    async deleteComment(id: string) {
        const result = await commentsCollection
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}