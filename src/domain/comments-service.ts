import {CommentMongoDBModel} from "../db/db-models";
import {commentsDbRepository} from "../repositories/db-repositories/comments-db-repository";
import {mapperDbRepository} from "../repositories/mapper-db-repository";
import {CommentViewModel} from "../models/repository/comments-models";
import {ObjectId} from "mongodb";


export const commentsService = {
    async createComment(postId: string, content: string, userId: ObjectId, login: string): Promise<CommentViewModel | null> {
        const newComment: CommentMongoDBModel = {
            postId: postId,
            content: content,
            userId: userId.toString(),
            userLogin: login,
            createdAt: new Date().toISOString()
        }
        const commentDB = await commentsDbRepository.creatComment(newComment)
        if (commentDB)
            return mapperDbRepository.CommentViewMongoDBtoCommentViewModel(commentDB)
        else

            return null
    },
    async findCommentById (id: string): Promise<CommentViewModel | null> {
        const commentDB = await commentsDbRepository.findCommentById(id)
        if (commentDB)
            return mapperDbRepository.CommentViewMongoDBtoCommentViewModel(commentDB)
        else
            return null
    },
    async deleteAllComments(): Promise<boolean> {
        return commentsDbRepository.deleteAllComments()
    },
    async updateComment(commentId: string, commentContent: string) {
        return commentsDbRepository.updateComment(commentId, commentContent)
    },
    async deleteComment(id: string) {
        return await commentsDbRepository.deleteComment(id)
    }
}