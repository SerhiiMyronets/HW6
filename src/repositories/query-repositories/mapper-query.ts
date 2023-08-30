import {BlogViewModel} from "../../models/repository/blogs-models";
import {PostViewModel} from "../../models/repository/posts-models";
import {UsersViewModel} from "../../models/repository/users-models";
import { CommentViewModel} from "../../models/repository/comments-models";

export enum sortDirectionList {
    "asc" = 1,
    "desc" = -1
}
export const mapperQuery = {
    blogViewModelToBlogViewModelPaginated(items: Array<BlogViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    },
    postViewModelToPostViewModelPaginated(items: Array<PostViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    },
    userViewModelToUserViewModelPaginated(items: Array<UsersViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    },
    commentViewModelToCommentsViewModelPaginated(items: Array<CommentViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    }
}