import {PostModel} from "../../db/db";
import {FindPostsPaginateModel, PostViewModel} from "../../models/repository/posts-models";
import {sortDirectionList} from "../../setting";

type Pagination<T> = {
    page: number
    pageSize: number
    items: T[]
}

export class PostsQueryRepository {
    async findPostsQuery(query: FindPostsPaginateModel): Promise<Pagination<PostViewModel>> {
        const totalCount = await PostModel.countDocuments()
        const foundedPosts: PostViewModel[] = await PostModel
            .find({}, {
                _id: 0,
                id: {$toString: '$_id'},
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            })
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize).lean()
        return this.getPaginated(foundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }

    async isPostExisting(_id: string): Promise<boolean> {
        const result = await PostModel
            .findOne({_id})
        return !!result;
    }

    async findPostById(_id: string): Promise<PostViewModel | null> {
        return PostModel.findOne({_id}).lean()
    }

    async findPostsByBlogIdQuery(query: FindPostsPaginateModel, blogId: string): Promise<Pagination<PostViewModel>> {
        const totalCount = await PostModel.countDocuments({"blogId": blogId})
        const foundedPosts: PostViewModel[] = await PostModel
            .find({"blogId": blogId}, {
                _id: 0,
                id: {$toString: '$_id'},
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            })
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize).lean()
        return this.getPaginated(foundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }

    getPaginated<Type>(items: Array<Type>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    }
}