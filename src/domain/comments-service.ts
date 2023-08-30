import {CommentInputMongoDB} from "../models/db-models";
import {commentsDbRepository} from "../repositories/db-repositories/comments-db-repository";
import {mapperRepository} from "../repositories/mapper-repository";
import {CommentViewModel} from "../models/repository/comments-models";


export const commentsService = {
    async createComment(postId: string, content: string, userId: string, login: string): Promise<CommentViewModel | null> {
        const newComment: CommentInputMongoDB = {
            postId: postId,
            content: content,
            userId: userId,
            userLogin: login,
            createdAt: new Date().toISOString()
        }
        const commentDB = await commentsDbRepository.creatComment(newComment)
        if (commentDB)
            return mapperRepository.CommentViewMongoDBtoCommentViewModel(commentDB)
        else

            return null
    },
    async findCommentById (id: string): Promise<CommentViewModel | null> {
        const commentDB = await commentsDbRepository.findCommentById(id)
        if (commentDB)
            return mapperRepository.CommentViewMongoDBtoCommentViewModel(commentDB)
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