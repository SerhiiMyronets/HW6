import {PostModel} from "../../db/db";
import {FindPostsPaginateModel, PostViewModel} from "../../models/repository/posts-models";
import {sortDirectionList} from "../../setting";
import {LikesStatusQueryModel} from "../../models/repository/comments-models";

type Pagination<T> = {
    page: number
    pageSize: number
    items: T[]
}

export class PostsQueryRepository {
    async findPostsQuery(query: FindPostsPaginateModel, likesStatus: LikesStatusQueryModel): Promise<Pagination<PostViewModel>> {
        const totalCount = await PostModel.countDocuments()
        let foundedPosts: Array<PostViewModel> = await PostModel
            .find({}, {
                _id: 0,
                id: {$toString: '$_id'},
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1,
                "extendedLikesInfo.likesCount": 1,
                "extendedLikesInfo.dislikesCount": 1,
                "extendedLikesInfo.myStatus": "None",
                "extendedLikesInfo.newestLikes": 1
            })
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize).lean()
        if (foundedPosts && likesStatus.length > 0)
            this.unifyPostsAndLikes(foundedPosts, likesStatus)
        return this.getPaginated(foundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }

    async isPostExisting(_id: string): Promise<boolean> {
        const result = await PostModel
            .findOne({_id})
        return !!result;
    }

    async findPostById(_id: string, likeStatus: string = 'None'): Promise<PostViewModel | null> {
        return PostModel.findById({_id},
            {
                _id: 0,
                id: {$toString: '$_id'},
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1,
                "extendedLikesInfo.likesCount": 1,
                "extendedLikesInfo.dislikesCount": 1,
                "extendedLikesInfo.myStatus": likeStatus,
                "extendedLikesInfo.newestLikes": 1,
            }).lean()
    }

    async findPostsByBlogIdQuery(query: FindPostsPaginateModel, blogId: string, likesStatus: LikesStatusQueryModel): Promise<Pagination<PostViewModel>> {
        const totalCount = await PostModel.countDocuments({blogId})
        const foundedPosts: Array<PostViewModel> = await PostModel
            .find({blogId}, {
                _id: 0,
                id: {$toString: '$_id'},
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1,
                "extendedLikesInfo.likesCount": 1,
                "extendedLikesInfo.dislikesCount": 1,
                "extendedLikesInfo.myStatus": "None",
                "extendedLikesInfo.newestLikes": 1,
            })
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize).lean()
        if (foundedPosts && likesStatus.length > 0)
            this.unifyPostsAndLikes(foundedPosts, likesStatus)
        return this.getPaginated(foundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }

    unifyPostsAndLikes(foundedPosts: Array<PostViewModel>, likesStatus: LikesStatusQueryModel) {
        return foundedPosts.map((el) => {
            for (let i = 0; i < likesStatus.length; i++) {
                if (likesStatus[i].id === el.id) {
                    el.extendedLikesInfo.myStatus = likesStatus[i].likeStatus
                }
            }
        })
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