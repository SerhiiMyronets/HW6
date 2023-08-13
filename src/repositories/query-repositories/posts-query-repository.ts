import {findPostsQueryModel, sortDirectionList} from "../../models/find-posts-query-model";
import {postsCollection} from "../../db/db";
import {PostOutputMongoDB, PostViewModel} from "../../models/posts-models";


export const postsQueryRepository = {
     async findPostsQuery(query: findPostsQueryModel) {
        if (!query.pageNumber) query.pageNumber = 1
        if (!query.pageSize) query.pageSize = 10
        if (!query.sortBy) query.sortBy = "createdAt"
        if (!query.sortDirection) query.sortDirection = "desc"


        const totalCount = await postsCollection.countDocuments()
        const foundedPosts = await postsCollection
            .find()
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedPosts = foundedPosts.map(
            b => this._mapPostOutputMongoDBToPostViewModel(b))

        return this._PostsPagination(mappedFoundedPosts, query.pageNumber, query.pageSize, totalCount)
    },
    _mapPostOutputMongoDBToPostViewModel(postDB: PostOutputMongoDB) {
        return {
            id: postDB._id.toString(),
            title: postDB.title,
            shortDescription: postDB.shortDescription,
            content: postDB.content,
            blogId: postDB.blogId,
            blogName: postDB.blogName,
            createdAt: postDB.createdAt
        }
    },
    _PostsPagination(items: Array<PostViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    }
}