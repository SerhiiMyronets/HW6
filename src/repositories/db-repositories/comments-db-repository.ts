import {CommentInputMongoDB, CommentViewMongoDB} from "../../models/db-models";
import {commentsCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const commentsDbRepository = {
    async creatComment(newComment: CommentInputMongoDB): Promise<CommentViewMongoDB | null> {
        const res = await commentsCollection
            .insertOne(newComment)
        return this.findCommentById(res.insertedId.toString());
    },
    async findCommentById(id: string): Promise<CommentViewMongoDB | null> {
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