import { commentsCollection} from "../../db/db";
import {CommentsViewModelPaginated, findCommentsPaginateModel} from "../../models/repository/comments-models";
import {mapperQuery, sortDirectionList} from "./mapper-query";
import {mapperRepository} from "../mapper-repository";

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
            b => mapperRepository.CommentViewMongoDBtoCommentViewModel(b))
        return mapperQuery.commentViewModelToCommentsViewModelPaginated(
            mappedFoundedComments, +query.pageNumber, +query.pageSize, totalCount)
    },

}