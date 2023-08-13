import {findBlogsQueryModel, findPostsByIdQueryModel, sortDirectionList} from "../../models/find-blogs-query-model";
import {blogsCollection, postsCollection} from "../../db/db";
import {BlogOutputMongoDB, BlogViewModel} from "../../models/blogs-models";
import {ObjectId} from "mongodb";
import {PostOutputMongoDB, PostViewModel} from "../../models/posts-models";




export const blogsQueryRepository = {
    async findBlogsQuery(query: findBlogsQueryModel) {
        if (!query.searchNameTerm) query.searchNameTerm = ""
        if (!query.sortBy) query.sortBy = "name"
        if (!query.sortDirection) query.sortDirection = "desc"
        if (!query.pageNumber) query.pageNumber = 1
        if (!query.pageSize) query.pageSize = 10

        const term = new RegExp(".*" + query.searchNameTerm + ".*", "i")
        const totalCount = await blogsCollection.countDocuments({"name": term})
        const foundedBlogs = await blogsCollection
            .find({"name": term})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedBlogs = foundedBlogs.map(
            b => this._mapBlogOutputMongoDBToBlogViewModel(b))

        return this._BlogsPagination(mappedFoundedBlogs, query.pageNumber, query.pageSize, totalCount)
    },
    async findPostsByIdQuery(query: findPostsByIdQueryModel, blogId: string) {
        if (!query.pageNumber) query.pageNumber = 1
        if (!query.pageSize) query.pageSize = 10
        if (!query.sortBy) query.sortBy = "createdAt"
        if (!query.sortDirection) query.sortDirection = "desc"


        const totalCount = await postsCollection.countDocuments({"blogId": blogId})
        const foundedBlogs = await postsCollection
            .find()
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedBlogs = foundedBlogs.map(
            b => this._mapPostOutputMongoDBToPostViewModel(b))

        return this._PostsPagination(mappedFoundedBlogs, query.pageNumber, query.pageSize, totalCount)
    },
    async isBlogExisting(id: string): Promise<boolean> {
        const result = await blogsCollection
            .findOne({_id: new ObjectId(id)})
        return !!result;
    },
    _mapBlogOutputMongoDBToBlogViewModel(blogDB: BlogOutputMongoDB) {
        return {
            id: blogDB._id.toString(),
            name: blogDB.name,
            description: blogDB.description,
            websiteUrl: blogDB.websiteUrl,
            createdAt: blogDB.createdAt,
            isMembership: blogDB.isMembership
        }
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
    _BlogsPagination(items: Array<BlogViewModel>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
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