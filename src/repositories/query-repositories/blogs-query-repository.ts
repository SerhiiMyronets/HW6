import {findBlogsQueryModel, findPostsByIdQueryModel, sortDirectionList} from "../../models/find-blogs-query-model";
import {blogsCollection, postsCollection} from "../../db/db";
import {BlogViewModel} from "../../models/blogs-models";
import {ObjectId} from "mongodb";
import {PostViewModel} from "../../models/posts-models";
import {mapper} from "../mapper";

export const blogsQueryRepository = {
    async findBlogsQuery(query: findBlogsQueryModel) {
        const term = new RegExp(".*" + query.searchNameTerm + ".*", "i")
        const totalCount = await blogsCollection.countDocuments({"name": term})
        const foundedBlogs = await blogsCollection
            .find({"name": term})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        const mappedFoundedBlogs = foundedBlogs.map(
            b => mapper.blogOutputMongoDBToBlogViewModel(b))

        return this._Pagination(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)
    },
    async findPostsByBlogIdQuery(query: findPostsByIdQueryModel, blogId: string) {
        const totalCount = await postsCollection.countDocuments({"blogId": blogId})
        const foundedPosts = await postsCollection
            .find({"blogId": blogId})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedPosts = foundedPosts.map(
            b => mapper.postOutputMongoDBToPostViewModel(b))
        return this._Pagination(mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    },
    async isBlogExisting(id: string): Promise<boolean> {
        const result = await blogsCollection
            .findOne({_id: new ObjectId(id)})
        return !!result;
    },
    _Pagination(items: Array<BlogViewModel | PostViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    }
}