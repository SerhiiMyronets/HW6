import {CommentMongoDBModel} from "../db/db-models";
import {commentsDbRepository} from "../repositories/db-repositories/comments-db-repository";
import {mapperDbRepository} from "../repositories/mapper-db-repository";
import {CommentViewModel} from "../models/repository/comments-models";
import {ObjectId} from "mongodb";


export const commentsService = {
    async createComment(postId: string, content: string, userId: ObjectId, login: string): Promise<string> {
        const newComment: CommentMongoDBModel = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId.toString(),
                userLogin: login,
            },
            createdAt: new Date(),
            likesInfo: {
                likedUsersList: [],
                dislikedUsersList: [],
                myStatus: ''
            }
        }
        return await commentsDbRepository.creatComment(newComment)
    },
    async findCommentById(id: string): Promise<CommentViewModel | null> {
        const commentDB = await commentsDbRepository.findCommentById(id)
        if (commentDB)
            return mapperDbRepository.commentViewMongoDBtoCommentViewModel(commentDB)
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
        return commentsDbRepository.deleteComment(id)
    },
    async updateLikeStatus(commentId: string, desiredLikeStatus: string, userId: string) {
        let currentLikeStatus = await commentsDbRepository.getCommentStatus(commentId, userId)
        console.log('current', currentLikeStatus)
        console.log('desire', desiredLikeStatus)
        // if (currentLikeStatus == 'Dislike' && desiredLikeStatus == 'Dislike')
        //     await commentsDbRepository.removeDislike(commentId, userId)
        // if (currentLikeStatus == 'Like' && desiredLikeStatus == 'Like')
        //     await commentsDbRepository.removeLike(commentId, userId)
        if (currentLikeStatus == 'None' && desiredLikeStatus == 'Like')
            await commentsDbRepository.addLike(commentId, userId)
        if (currentLikeStatus == 'None' && desiredLikeStatus == 'Dislike')
            await commentsDbRepository.addDislike(commentId, userId)
        if (currentLikeStatus == 'Dislike' && desiredLikeStatus == 'Like') {
            await commentsDbRepository.removeDislike(commentId, userId)
            await commentsDbRepository.addLike(commentId, userId)
        }
        if (currentLikeStatus == 'Like' && desiredLikeStatus == 'Dislike') {
            await commentsDbRepository.removeLike(commentId, userId)
            await commentsDbRepository.addDislike(commentId, userId)
        }
        currentLikeStatus = await commentsDbRepository.getCommentStatus(commentId, userId)
        console.log("result", currentLikeStatus)
        console.log("------------------------------")
        return true
    }
}