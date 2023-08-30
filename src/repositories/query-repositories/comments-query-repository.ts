import { commentsCollection} from "../../db/db";
import {CommentsViewModelPaginated, findCommentsPaginateModel} from "../../models/repository/comments-models";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";
import {mapperDbRepository} from "../mapper-db-repository";

export const commentsQueryRepository = {
    async findCommentsByPostIdQuery (query:findCommentsPaginateModel, postId: string): Promise<CommentsViewModelPaginated> {
        const totalCount = await commentsCollection.countDocuments({"postId": postId})
        const foundedComments = await commentsCollection
            .find({"postId": postId})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        const mappedFoundedComments = foundedComments.map(
            b => mapperDbRepository.CommentViewMongoDBtoCommentViewModel(b))
        return mapperQueryRepository.commentViewModelToCommentsViewModelPaginated(
            mappedFoundedComments, +query.pageNumber, +query.pageSize, totalCount)
    },

}