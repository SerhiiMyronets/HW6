import {
    CommentsViewModelPaginated,
    CommentViewModel,
    findCommentsPaginateModel
} from "../../models/repository/comments-models";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";
import {CommentModel} from "../../db/db";
import {ObjectId} from "mongodb";


export const commentsQueryRepository = {
    async findCommentsByPostIdQuery(query: findCommentsPaginateModel, postId: string, userId?: string): Promise<CommentsViewModelPaginated> {
        const totalCount = await CommentModel.countDocuments({"postId": postId})
        let myStatusFieldValue: any
        if (userId)
            myStatusFieldValue = {
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
        else
            myStatusFieldValue = "None"
        const foundedComments = await CommentModel
            .aggregate([{$match: {"postId": postId}},
                {$addFields: {id: '$_id'}},
                {
                    $addFields: {
                        likesInfo: {
                            likesCount: {$size: '$likesInfo.likedUsersList'},
                            dislikesCount: {$size: '$likesInfo.dislikedUsersList'},
                            myStatus: myStatusFieldValue
                        }
                    }
                },
                {
                    $project: {
                        __v: 0,
                        _id: 0,
                        'likesInfo.likedUsersList': 0,
                        'likesInfo.dislikedUsersList': 0,
                        postId: 0
                    }
                }])
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
        // const mappedFoundedComments = foundedComments.map(
        //     b => mapperDbRepository.commentViewMongoDBtoCommentViewModel(b))
        return mapperQueryRepository.commentViewModelToCommentsViewModelPaginated(
            foundedComments, +query.pageNumber, +query.pageSize, totalCount)
    }, async findCommentById(commentId: string, userId?: string): Promise<CommentViewModel | null> {
        let myStatusFieldValue: any
        if (userId)
            myStatusFieldValue = {
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
        else
            myStatusFieldValue = "None"
        const comment = await CommentModel
            .aggregate([{$match: {"_id": new ObjectId(commentId)}},
                {$addFields: {id: '$_id'}},
                {
                    $addFields: {
                        likesInfo: {
                            likesCount: {$size: '$likesInfo.likedUsersList'},
                            dislikesCount: {$size: '$likesInfo.dislikedUsersList'},
                            myStatus: myStatusFieldValue
                        }
                    }
                },
                {
                    $project: {
                        __v: 0,
                        _id: 0,
                        'likesInfo.likedUsersList': 0,
                        'likesInfo.dislikedUsersList': 0,
                        postId: 0
                    }
                }])
        if (comment.length === 0) return null
        // @ts-ignore
        else return comment[0]
    }
}