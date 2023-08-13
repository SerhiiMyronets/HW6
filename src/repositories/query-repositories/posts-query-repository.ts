import {findPostsQueryModel, sortDirectionList} from "../../models/find-posts-query-model";
import {postsCollection} from "../../db/db";
import {PostViewModel} from "../../models/posts-models";
import {mapper} from "../mapper";


export const postsQueryRepository = {
     async findPostsQuery(query: findPostsQueryModel) {
        const totalCount = await postsCollection.countDocuments()
        const foundedPosts = await postsCollection
            .find()
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedPosts = foundedPosts.map(
            b => mapper.postOutputMongoDBToPostViewModel(b))

        return this._Pagination(mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    },
    _Pagination(items: Array<PostViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    }
}